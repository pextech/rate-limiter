provider "aws" {
    region = var.region
  
}

resource "aws_iam_role" "role-elb" {
  name = "role-elb-rate-limit"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "tf-ellb" {
  name = "aws-elasticbeanstalk-ec2-role-rate-limit" 

  role = aws_iam_role.role-elb.name
}

resource "aws_elastic_beanstalk_application" "rate-limiter-v1" {
  name  = "rate-limiter-v1"
  description = "Testing tf-elb"
  
}

resource "aws_elastic_beanstalk_environment" "rate-limiter-v1-staging" {
  name                = "rate-limiter-v1-staging"
  application = aws_elastic_beanstalk_application.rate-limiter-v1.name
  solution_stack_name = "64bit Amazon Linux 2 v3.6.2 running Docker"
  tier = "WebServer"
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.tf-ellb.name
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCID"
    value = var.vpc_id

  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", var.subnet)
  }
  setting {
    namespace = "aws:ec2:instances"
    name = "InstanceTypes"
    value = var.instance_type
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBScheme"
    value     = "public"
  }
}

output "url" {
  value = aws_elastic_beanstalk_environment.rate-limiter-v1-staging.endpoint_url
}