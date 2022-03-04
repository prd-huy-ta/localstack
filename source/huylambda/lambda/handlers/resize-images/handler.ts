import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import sharp from "sharp";
import type {Readable} from "stream"

export const imageResizeHandler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    try {
        let image: Buffer
        const body = event.queryStringParameters || {};

        const inputLocationParams = {
            Bucket: body.Bucket,
            Key: body.Key
        }

        const resizeParams = {
            width: parseInt(body.width || '200'),
            height: parseInt(body.height || '200'),
        }

        const outputLocationParams = {
            Bucket: body.Bucket,
            Key: body.output
        }


        const client = new S3Client({})
        const command = new GetObjectCommand(inputLocationParams);
        const imageObject = await client.send(command);

        const stream = imageObject.Body as Readable

        const streamToBuffer = (stream: Readable) => new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = []
            stream.on('data', chunk => chunks.push(chunk))
            stream.once('end', () => resolve(Buffer.concat(chunks)))
            stream.once('error', reject)
        })

        image = await streamToBuffer(stream)


        const resizedImage = await sharp(image).resize(resizeParams).toBuffer()
        const putObjectCommand = new PutObjectCommand({...outputLocationParams, Body: resizedImage});

        const data = await client.send(putObjectCommand)

        console.log(data)

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };

    } catch
        (e) {
        console.error(e);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error happened!',
            }),
        };
    }
    return response
}