variable "region" {
    default = "ap-northeast-1"
}

variable "language" {
    default = "Node.js"
}

variable "vpc_id" {
  default = "vpc-000fad2727d937958"
}

variable "subnet" {
    default = ["subnet-0fd9730155345441d"]
  
}

variable "instance_type" {
    default = "t2.micro"
  
}