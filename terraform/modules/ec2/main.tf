resource "aws_key_pair" "this" {
	key_name   = "${var.project_name}-key"
	public_key = var.public_key
}

resource "aws_security_group" "this" {
	name = "${var.project_name}-sg"
	ingress { from_port = 22, to_port = 22, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }
	ingress { from_port = 80, to_port = 80, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }
	egress { from_port = 0, to_port = 0, protocol = "-1", cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_instance" "this" {
	ami                    = var.ami_id
	instance_type          = var.instance_type
	key_name               = aws_key_pair.this.key_name
	vpc_security_group_ids = [aws_security_group.this.id]
	user_data              = <<-USERDATA
		#!/bin/bash
		apt-get update -y
		apt-get install -y docker.io
		systemctl enable --now docker
	USERDATA
	tags = { Name = var.project_name }
}
