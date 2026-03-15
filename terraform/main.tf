# =============================================================================
# Main Terraform Configuration - Inventory Management System Frontend
# This file defines the AWS provider configuration and core networking
# infrastructure including VPC, subnets, internet gateway, and route tables.
# =============================================================================

# -- Terraform Settings --
# Specifies the required providers and their version constraints.
# The AWS provider is the only required provider for this infrastructure.
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# -- AWS Provider Configuration --
# Configures the AWS provider with the target region.
# Credentials are sourced from environment variables or AWS CLI profile.
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Student     = "VishvaksenMachana-25173421"
    }
  }
}

# -- Data Source: Availability Zones --
# Dynamically fetches available AZs in the selected region.
# This avoids hardcoding AZ names which vary between regions.
data "aws_availability_zones" "available" {
  state = "available"
}

# =============================================================================
# VPC - Virtual Private Cloud
# The isolated network environment for all project resources.
# DNS support is enabled for RDS endpoint resolution.
# =============================================================================
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# =============================================================================
# Public Subnets
# Two public subnets across different AZs for the EC2 instance and
# internet-facing resources. map_public_ip_on_launch ensures instances
# receive a public IP automatically.
# =============================================================================
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-${count.index + 1}"
  }
}

# =============================================================================
# Private Subnets
# Two private subnets across different AZs for the RDS database.
# RDS requires a DB subnet group with subnets in at least two AZs.
# No public IP assignment for security isolation.
# =============================================================================
resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-private-subnet-${count.index + 1}"
  }
}

# =============================================================================
# Internet Gateway
# Provides internet connectivity for resources in public subnets.
# Required for the EC2 instance to receive traffic and for S3 access.
# =============================================================================
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# =============================================================================
# Route Table for Public Subnets
# Directs all non-local traffic (0.0.0.0/0) through the Internet Gateway.
# This makes the associated subnets "public" by enabling internet access.
# =============================================================================
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# -- Route Table Associations --
# Associates each public subnet with the public route table.
# Without this association, subnets use the VPC's default route table.
resource "aws_route_table_association" "public" {
  count          = length(var.public_subnet_cidrs)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
