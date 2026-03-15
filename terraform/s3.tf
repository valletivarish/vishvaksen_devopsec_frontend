# =============================================================================
# S3 Bucket Configuration - Frontend Static Website Hosting
# This file defines the S3 bucket that serves the React production build
# as a static website. The CI/CD pipeline deploys the built files here
# after a successful build on the main branch.
# =============================================================================

# =============================================================================
# S3 Bucket
# The primary storage resource for the frontend static files.
# The bucket name must be globally unique across all AWS accounts.
# =============================================================================
resource "aws_s3_bucket" "frontend" {
  bucket = var.s3_bucket_name

  tags = {
    Name = "${var.project_name}-frontend-bucket"
  }
}

# =============================================================================
# S3 Bucket Website Configuration
# Enables static website hosting on the S3 bucket.
# index.html is served for all routes, and error.html handles 404s.
# For single-page React apps, the error document also points to index.html
# so that React Router can handle client-side routing.
# =============================================================================
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  # The main entry point for the React application
  index_document {
    suffix = "index.html"
  }

  # Redirect all 404 errors to index.html for React Router to handle
  error_document {
    key = "index.html"
  }
}

# =============================================================================
# S3 Bucket Public Access Block
# Allows public read access to the bucket contents so that users can
# access the frontend website. All four public access settings are
# disabled to permit the bucket policy to grant public read.
# =============================================================================
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  # Disable all public access blocks to allow the bucket policy
  # to grant public read access for website hosting
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# =============================================================================
# S3 Bucket Policy - Public Read Access
# Grants public read access to all objects in the bucket.
# This is required for the static website to be accessible via the
# S3 website endpoint URL. Only GetObject is permitted (read-only).
# =============================================================================
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  # Ensure the public access block settings are applied before the policy
  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# =============================================================================
# S3 Bucket CORS Configuration
# Enables Cross-Origin Resource Sharing for the frontend bucket.
# This allows the frontend to make API requests to the backend EC2
# instance on a different origin without browser CORS restrictions.
# =============================================================================
resource "aws_s3_bucket_cors_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  cors_rule {
    # Allow requests from any origin (can be restricted to specific domains)
    allowed_origins = ["*"]

    # Allow standard HTTP methods used by the frontend
    allowed_methods = ["GET", "HEAD"]

    # Allow common request headers
    allowed_headers = ["*"]

    # Cache preflight responses for 1 hour to reduce OPTIONS requests
    max_age_seconds = 3600
  }
}
