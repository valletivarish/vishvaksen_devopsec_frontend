# =============================================================================
# Input Variables for Inventory Management System Frontend Infrastructure
# These variables allow configuration of the AWS resources without modifying
# the main Terraform files. Override values via terraform.tfvars or CLI flags.
# =============================================================================

# -- AWS Region Configuration --
# The AWS region where all resources will be provisioned.
# eu-west-1 (Ireland) is chosen for proximity to the UK-based NCI deployment.
variable "aws_region" {
  description = "AWS region for resource provisioning"
  type        = string
  default     = "eu-west-1"
}

# -- Project Naming --
# Used as a prefix for naming AWS resources to avoid conflicts
# and to clearly identify resources belonging to this project.
variable "project_name" {
  description = "Project name used for tagging and naming AWS resources"
  type        = string
  default     = "inventory-mgmt"
}

# -- Environment Tag --
# Identifies the deployment environment (dev, staging, production).
# This helps distinguish resources across different environments.
variable "environment" {
  description = "Deployment environment identifier"
  type        = string
  default     = "production"
}

# -- VPC CIDR Block --
# The IP address range for the Virtual Private Cloud.
# A /16 block provides 65,536 IP addresses for subnets and resources.
variable "vpc_cidr" {
  description = "CIDR block for the VPC network"
  type        = string
  default     = "10.0.0.0/16"
}

# -- Public Subnet CIDR Blocks --
# Two public subnets in different availability zones for high availability.
# These subnets have direct internet access via the Internet Gateway.
variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (minimum two for high availability)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# -- Private Subnet CIDR Blocks --
# Two private subnets for database instances (RDS requires multi-AZ subnet group).
# These subnets have no direct internet access for security.
variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets used by RDS"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

# -- EC2 Instance Configuration --
# The instance type for the backend application server.
# t2.micro is included in the AWS Free Tier.
variable "instance_type" {
  description = "EC2 instance type for the backend application server"
  type        = string
  default     = "t3.micro"
}

# -- EC2 Key Pair --
# Name of the SSH key pair for EC2 instance access.
# This key pair must already exist in the target AWS region.
variable "key_name" {
  description = "Name of the existing EC2 key pair for SSH access"
  type        = string
  default     = "inventory-mgmt-key"
}

# -- AMI ID --
# Amazon Machine Image ID for the EC2 instance.
# Default uses Amazon Linux 2023 in eu-west-1.
variable "ami_id" {
  description = "AMI ID for the EC2 instance (Amazon Linux 2023)"
  type        = string
  default     = "ami-0d64bb532e0502c46"
}

# -- Database Configuration --
# RDS MySQL instance settings for the application database.
# db.t3.micro is included in the AWS Free Tier for 12 months.
variable "db_instance_class" {
  description = "RDS instance class for the MySQL database"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name of the MySQL database"
  type        = string
  default     = "inventory_db"
}

variable "db_username" {
  description = "Master username for the RDS MySQL instance"
  type        = string
  default     = "admin"
}

# -- Database Password --
# Marked as sensitive to prevent it from appearing in Terraform output.
# Must be provided at runtime via terraform.tfvars or environment variable.
variable "db_password" {
  description = "Master password for the RDS MySQL instance (provide at runtime)"
  type        = string
  sensitive   = true
}

# -- S3 Bucket Name --
# Globally unique name for the S3 bucket hosting the frontend static files.
# Must be globally unique across all AWS accounts.
variable "s3_bucket_name" {
  description = "Globally unique S3 bucket name for frontend static hosting"
  type        = string
  default     = "inventory-mgmt-frontend-25173421"
}
