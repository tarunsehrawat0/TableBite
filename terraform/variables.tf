variable "aws_region" { type = string, default = "us-east-1" }
variable "ami_id" { type = string, description = "Ubuntu AMI for the selected region" }
variable "instance_type" { type = string, default = "t3.micro" }
variable "project_name" { type = string, default = "tablebite" }
variable "public_key" { type = string, sensitive = true, description = "SSH public key material" }
