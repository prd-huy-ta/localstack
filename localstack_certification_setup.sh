mkdir -p ~/.aws
echo "[default]">>~/.aws/credentials
echo "aws_access_key_id = ezoqueeWahs2oiPh">>~/.aws/credentials
echo "aws_secret_access_key = Tiwouhuro7Eiw8eedil9eiRuNae5Reyi">>~/.aws/credentials
echo "[default]">>~/.aws/config
echo "region = us-east-1">>~/.aws/config
 
echo "# S3 on LocalStack">>~/.profile
echo "export AWS_ACCESS_KEY_ID=ezoqueeWahs2oiPh">>~/.profile
echo "export AWS_SECRET_ACCESS_KEY=Tiwouhuro7Eiw8eedil9eiRuNae5Reyi">>~/.profile
echo "export AWS_REGION=us-east-1">>~/.profile
