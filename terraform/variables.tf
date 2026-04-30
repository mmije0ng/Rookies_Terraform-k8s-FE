variable "region" {
  default = "us-west-1"
}

variable "project" {
  default = "myapp"
}

variable "environment" {
  default = "dev"
}

variable "key_pair_name" {
  description = "EC2 접속용 키페어 이름"
  type        = string
}
