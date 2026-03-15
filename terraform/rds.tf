# =============================================================================
# RDS MySQL Configuration - Application Database
# This file defines the MySQL database instance used by the backend API.
# The database is placed in private subnets for security isolation,
# accessible only from the EC2 backend instance within the same VPC.
# =============================================================================

# =============================================================================
# DB Subnet Group
# RDS requires a subnet group spanning at least two availability zones.
# Using private subnets ensures the database is not directly accessible
# from the public internet, following security best practices.
# =============================================================================
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# =============================================================================
# Security Group for RDS Instance
# Restricts database access to only the EC2 backend instance.
# MySQL uses port 3306 by default. Only traffic from the EC2 security
# group is permitted, preventing unauthorized database access.
# =============================================================================
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS MySQL allowing access only from EC2 backend"
  vpc_id      = aws_vpc.main.id

  # Allow MySQL traffic only from the EC2 backend security group
  ingress {
    description     = "MySQL access from backend EC2 instance only"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  # Allow all outbound traffic for database updates and patches
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# =============================================================================
# RDS MySQL Instance
# The managed MySQL 8.0 database for the Inventory Management System.
# Configuration choices:
#   - db.t3.micro: AWS Free Tier eligible for 12 months
#   - 20 GB gp2 storage: General Purpose SSD, sufficient for this project
#   - No Multi-AZ: Not required for a student project, reduces cost
#   - skip_final_snapshot: Avoids manual cleanup of snapshots during teardown
# =============================================================================
resource "aws_db_instance" "mysql" {
  identifier     = "${var.project_name}-db"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = var.db_instance_class

  # Database credentials and name
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  # Storage configuration - 20 GB is sufficient for inventory data
  allocated_storage = 20
  storage_type      = "gp2"

  # Network configuration - private subnets only
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  # Disable public access for security - database should only be
  # reachable from the EC2 instance within the VPC
  publicly_accessible = false

  # Disable Multi-AZ for cost savings in a student project
  multi_az = false

  # Skip final snapshot on deletion to simplify teardown
  skip_final_snapshot = true

  tags = {
    Name = "${var.project_name}-mysql-db"
  }
}
