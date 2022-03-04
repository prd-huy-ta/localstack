import boto3
 
# S3 endpoint on local
endpoint_url = 'http://localhost:4566'
 
# Access s3 resource
s3_client = boto3.resource(
    service_name='s3',
    endpoint_url=endpoint_url
)
 
# Create bucket
s3_client.create_bucket(Bucket='huytatest')
 
# upload file to S3
s3_client.Object('huytatest', 'kremlin.jpg').put(
    Body=open('./kremlin.jpg', 'rb'), ACL='public-read')
 
# Get a bucket
bucket = s3_client.Bucket('huytatest')
 
# Get all bucket:
for key in bucket.objects.all():
    print(key.__dict__)
