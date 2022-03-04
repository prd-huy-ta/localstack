import os as os

temp_url = "http://huytatest.localhost:4566/test.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=test%2F20220304%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220304T033204Z&X-Amz-Expires=3600&X-Amz-Signature=8c2f5ba7a83aee63a2d29397fbf0a87d0c00c29178c98f9afe30145f9db70215&X-Amz-SignedHeaders=host&x-id=PutObject"
os.system('curl --request PUT --upload-file ./test.csv "' + temp_url + '"')
# print('curl --request PUT --upload-file ./test.csv "' + temp_url + '"')
