# Provider
provider "aws" {
  region  = "ap-south-1"
  access_key = "AKIAIJH7NN2DRXVKPXLA"
  secret_key = "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"
}

# VPC
resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "VPC"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "IGW"
  }
}

# Route Table
resource "aws_route_table" "router" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  /*route {
    cidr_block = "::/0"
    gateway_id = aws_internet_gateway.igw.id
  }*/

  tags = {
    Name = "Route-Table"
  }
}

# Subnet
resource "aws_subnet" "subnet" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "Subnet"
  }
}

# Association
/* resource "aws_route_table_association" "association" {
  subnet_id = aws_subnet.subnet.id
  route_table_id = aws_route_table.router.id
  tags = {
    name = "Association"
  }
} */

# Security Group
resource "aws_security_group" "sec-grp" {
  name = "Website"  
  vpc_id = aws_vpc.vpc.id
  
  ingress {
    description = "HTTPS"
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "MySQL"
    from_port = 3306
    to_port = 3306
    protocol = "tcp"
    cidr_blocks = ["10.0.2.0/24","10.0.3.0/24"]
  }

  /*egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }*/

  tags = {
    Name = "Website"
  }

}

# NIC
resource "aws_network_interface" "nic" {
  subnet_id = aws_subnet.subnet.id
  private_ips = ["10.0.1.50"]
  security_groups = [ aws_security_group.sec-grp.id ]
}

# Elastic IP
resource "aws_eip" "elastic-ip" {
  vpc = true
  network_interface = aws_network_interface.nic.id
  associate_with_private_ip = "10.0.1.50"
  depends_on = [ aws_internet_gateway.igw ]
}

# EC2
resource "aws_instance" "web-server" {
  ami = "ami-0a4a70bd98c6d6441"
  instance_type = "t2.micro"
  availability_zone = "ap-south-1a"
  #subnet_id = aws_subnet.subnet.id
  key_name = "keys"

  network_interface {
    device_index = 0
    network_interface_id = aws_network_interface.nic.id
  }

  tags = {
    Name = "Web-Server"
  }
}

############################################################

# Subnet for DB
resource "aws_subnet" "subnet-db-1" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "DB-Subnet-1"
  }
}

resource "aws_subnet" "subnet-db-2" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name = "DB-Subnet-2"
  }
}

# Subnet Groups
resource "aws_db_subnet_group" "subnet-grp" {
  name       = "subnet-grp"
  subnet_ids = [aws_subnet.subnet-db-1.id, aws_subnet.subnet-db-2.id]
}

# Security group DB
resource "aws_security_group" "db-sec-grp" {
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.50/32"]
  }

  egress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.50/32"]
  }
}


# DB Instance
resource "aws_db_instance" "database" {
  allocated_storage       = 20
  storage_type            = "gp2"
  engine                  = "mysql"
  engine_version          = "8.0.15"
  instance_class          = "db.t2.micro"
  name                    = "dbserver"
  username                = "admin"
  password                = "admin123"
  port                    = 3306
  publicly_accessible     = false

  db_subnet_group_name    = aws_db_subnet_group.subnet-grp.id

  vpc_security_group_ids = [aws_security_group.db-sec-grp.id]

}