provider "aws" {
  region  = "ap-south-1"
}

#VPC
resource "aws_vpc" "terravpc-1" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "terravpc-1"
  }
}

#Internet gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.terravpc-1.id

  tags = {
    Name = "oogway"
  }
}

#Route table
resource "aws_route_table" "r" {
  vpc_id = aws_vpc.terravpc-1.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  route {
    ipv6_cidr_block        = "::/0"
    gateway_id             = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "terraroutetable"
  }
}

#Subnet

resource "aws_subnet" "terrasub-1" {
  vpc_id = aws_vpc.terravpc-1.id
  cidr_block = "10.0.1.0/24"
                
  tags = {
    Name = "terrasub-1"
  }
}

#associate

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.terrasub-1.id
  route_table_id = aws_route_table.r.id
}

#security group
resource "aws_security_group" "allow_traffic_all" {
  name        = "allow_terra"
  description = "Allow terra inbound traffic"
  vpc_id      = aws_vpc.terravpc-1.id

  ingress {
    description = "https from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "http from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "ssh from VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_terra"
  }
}

#network interface
resource "aws_network_interface" "test" {
  subnet_id       = aws_subnet.terrasub-1.id
  private_ips     = ["10.0.1.50" , "10.0.1.51"]
  security_groups = [aws_security_group.allow_traffic_all.id]

}

#EC2
resource "aws_instance" "server-1" {
  count = var.instance_count
  ami ="ami-04b1ddd35fd71475a"
  instance_type = "t2.micro"
  key_name = "terrainfra"

  tags = {
    Name = "cbserver ${count.index + 1}"
  }
}
