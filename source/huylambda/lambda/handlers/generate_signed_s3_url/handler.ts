import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {APIGatewayProxyEvent, APIGatewayProxyResult,} from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: { body: string; statusCode: number };
    let params = {Bucket: 'huytatest', Key: 'test.csv'};
    let s3Client: S3Client;
    const command = new PutObjectCommand(params);

    s3Client = new S3Client({"endpoint": "http://localhost:4566","region": 'us-east-1'});
    const url = await getSignedUrl(s3Client, command, {expiresIn: 3600});

    console.log('The URL is', url);
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Get S3-Signed-URL successfully!',
            url: url
        }),
    };
    return response;
}