# =============================================================================
# EC2 Instance Configuration - Backend Application Server
# This file defines the EC2 instance that hosts the Spring Boot backend,
# along with its security group for controlling network access.
# The frontend itself is hosted on S3, but the EC2 runs the backend API
# that the frontend communicates with.
# =============================================================================

# =============================================================================
# Security Group for EC2 Instance
# Controls inbound and outbound traffic to the backend application server.
# Allows SSH (port 22), HTTP (port 80), and the Spring Boot app (port 8080).
# =============================================================================
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Security group for the backend EC2 instance allowing SSH, HTTP, and app traffic"
  vpc_id      = aws_vpc.main.id

  # SSH access for remote administration and deployment
  ingress {
    description = "SSH access for server administration"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP access for web traffic
  ingress {
    description = "HTTP access for web traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Spring Boot application port for API access
  ingress {
    description = "Spring Boot application API port"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic for package downloads and external API calls
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}

# =============================================================================
# EC2 Instance - Backend Application Server
# Runs the Spring Boot backend application. Uses a user data script to
# install Java 17, download the application JAR, and start the service.
# Placed in a public subnet for direct API access from the S3-hosted frontend.
# =============================================================================
resource "aws_instance" "backend" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  # User data script runs on first boot to configure the server.
  # It installs Java 17, creates a systemd service for the Spring Boot app,
  # and starts the application automatically.
  user_data = <<-EOF
              #!/bin/bash
              # Update system packages to latest versions
              yum update -y

              # Install Amazon Corretto 17 (Java 17 JDK) for Spring Boot
              yum install -y java-17-amazon-corretto-devel

              # Create application directory for the backend JAR
              mkdir -p /opt/inventory-app

              # Create a systemd service file for automatic startup and restart
              cat > /etc/systemd/system/inventory-app.service <<'SERVICE'
              [Unit]
              Description=Inventory Management System Backend
              After=network.target

              [Service]
              Type=simple
              User=ec2-user
              WorkingDirectory=/opt/inventory-app
              ExecStart=/usr/bin/java -jar /opt/inventory-app/app.jar --spring.profiles.active=prod
              Restart=always
              RestartSec=10

              [Install]
              WantedBy=multi-user.target
              SERVICE

              # Enable the service to start on boot
              systemctl daemon-reload
              systemctl enable inventory-app.service
              EOF

  tags = {
    Name = "${var.project_name}-backend-server"
  }
}
