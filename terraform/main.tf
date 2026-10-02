terraform {
	required_version = ">= 1.5.0"
	required_providers {
		aws = { source = "hashicorp/aws", version = "~> 5.0" }
	}
}

provider "aws" { region = var.aws_region }

module "ec2" {
	source        = "./modules/ec2"
	ami_id        = var.ami_id
	instance_type = var.instance_type
	project_name  = var.project_name
	public_key    = var.public_key
}
