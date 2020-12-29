import boto3

s3 = boto3.resource('s3')
#s3c = boto3.client('s3')

##Functions.

def bucketcreation(bucketname, location):
    s3.create_bucket(Bucket=bucketname, CreateBucketConfiguration={
     'LocationConstraint': location})

def PrintBuckets():  
   print ('Buckets in your S3 ...')
   for bucket in s3.buckets.all():
      print('Bucket Name : ',bucket.name)

def PrintObjects(bucket_name):
    bucket = s3.Bucket(bucket_name)
    for file in bucket.objects.all():
      print(file.key)

def UploadObject(bucket_name):
    s3.Bucket(bucket_name).upload_file("F:\Dual_screen_wallpaper.png", "PyCode/wallpaper.png")

def PrintAll():
   for bucket in s3.buckets.all():
      print(bucket.name, ':')
      for key in bucket.objects.all():
          print("    ", key.key)

def DeleteObjectinBucket(bucket_name, object_name):
    s3.Object(bucket_name, object_name).delete()

def DeleteBucket(bucket_name):
    bucket = s3.Bucket(bucket_name)
    bucket.delete()

##Note: Uncomment the functions to use them.

##To List all Buckets and Objects inside them present in your S3.
#PrintAll()

##To List all Buckets.
#PrintBuckets()

##To List all Objects in a Bucket.
#PrintObjects('vscode-bucket01test')

##To create a Bucket.
#bucketcreation('figbucket-123', 'ap-south-1')

##To upload an Object.
#UploadObject('vscode-bucket01test')

##To Delete a Bucket.
#DeleteBucket()

##To Delete an Object in a bucket.
#DeleteObjectinBucket('demobckt-vscode', 'test.txt')