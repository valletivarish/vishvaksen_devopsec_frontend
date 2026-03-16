# =============================================================================
# Terraform Outputs - Inventory Management System Frontend Infrastructure
# These outputs display important resource identifiers and URLs after
# terraform apply completes. They are useful for configuring the CI/CD
# pipeline secrets and verifying the deployment.
# =============================================================================

# -- VPC Output --
# The VPC ID is needed when debugging network connectivity issues
# or when adding additional resources to the same network.
output "vpc_id" {
  description = "ID of the VPC hosting all project resources"
  value       = aws_vpc.main.id
}

# -- EC2 Outputs --
# The public IP and instance ID are needed for SSH access and
# for configuring the frontend API proxy or CORS settings.
output "ec2_public_ip" {
  description = "Elastic IP address of the backend EC2 instance"
  value       = aws_eip.backend.public_ip
}

output "ec2_instance_id" {
  description = "Instance ID of the backend EC2 server"
  value       = aws_instance.backend.id
}

# -- Backend API URL --
# The full URL for the backend API. This URL is used by the frontend
# application to make API requests to the Spring Boot backend.
output "backend_api_url" {
  description = "URL for the Spring Boot backend API"
  value       = "http://${aws_eip.backend.public_ip}:8080"
}

# -- RDS Outputs --
# The database endpoint is needed for the Spring Boot application
# configuration (spring.datasource.url in application-prod.properties).
output "rds_endpoint" {
  description = "Connection endpoint for the RDS MySQL database"
  value       = aws_db_instance.mysql.endpoint
}

output "rds_database_name" {
  description = "Name of the MySQL database"
  value       = aws_db_instance.mysql.db_name
}

# -- S3 Frontend Outputs --
# The website URL is the public-facing URL where users access the frontend.
# The bucket name is needed for the CI/CD pipeline S3 sync command.
output "frontend_website_url" {
  description = "S3 static website URL for the frontend application"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 frontend bucket for IAM policy reference"
  value       = aws_s3_bucket.frontend.arn
}
