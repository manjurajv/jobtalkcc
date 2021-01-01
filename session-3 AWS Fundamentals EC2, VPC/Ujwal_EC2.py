import boto3
import pprint
import sys

ec2 = boto3.resource('ec2')
ec2c = boto3.client('ec2')

def ListInstances():
 instances = ec2.instances.filter(
    Filters=[{'Name': 'instance-state-name', 'Values': ['running']}])
 for instance in instances:
    print(instance.id, instance.instance_type)

def ListInstanceStatus():
 for status in ec2.meta.client.describe_instance_status()['InstanceStatuses']:
    pprint.pprint(status)

def CreateEC2():
 ec2.create_instances(ImageId='<ami-image-id>', MinCount=1, MaxCount=5)

def StartEC2(instance_id):
   ec2c.start_instances(InstanceIds=[instance_id])

def StopEC2(instance_id): 
  ec2c.stop_instances(InstanceIds=[instance_id])

def RebootEC2(instance_id):
   ec2c.reboot_instances(InstanceIds=[instance_id])

def TerminateEC2(instance_id):
   ec2.instances.filter(InstanceIds=[instance_id]).terminate()
def VPC():
   vpc = ec2.create_vpc(CidrBlock='10.0.0.0/24')
   subnet = vpc.create_subnet(CidrBlock='10.0.0.0/25')
   gateway = ec2.create_internet_gateway()

##Note: Uncomment the functions to use them.

##To start an EC2 instance.
#StartEC2('i-0bf59300582753ffc')

##To stop an EC2 instace.
#StopEC2('i-0bf59300582753ffc')

##To Reboot an EC2 instance
#RebootEC2()

##To terminate an EC2 instance.
#TerminateEC2()

#To List all the running EC2 instances.
#ListInstances()

##To List EC2 instance status.
#ListInstanceStatus()

##To create an EC2 instance.
#CreateEC2()

##To create a VPC, Subnet and a Gateway.
#VPC()