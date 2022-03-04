import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import sharp, {FormatEnum} from "sharp";
import type {Readable} from "stream"

export const imageHandler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    try {
        const SUPPORTED_OUTPUT = ['jpg', 'jpeg', 'png']
        const params = event.queryStringParameters || {};

        console.log('----------------------------------')
        if (!params.Bucket || !params.Key) {
            throw new Error('You must specify a Bucket and a Key!')
        }

        if ((!params.width && !params.height) || !params.format) {
            throw new Error('You must specify an operation!')
        }

        const inputLocationParams = {
            Bucket: params.Bucket,
            Key: params.Key
        }
        const imageParams = {
            width: params.width || undefined,
            height: params.height || undefined,
            format: params.format || undefined
        }

        let newName = params.Key.split('.')[0]

        const client = new S3Client({
                // region: 'us-east-1',
            // endpoint: 'host.docker.internal:4566',
            // credentials: {
            //     accessKeyId: 'S3RVER',
            //     secretAccessKey: 'S3RVER'
            // },
            // forcePathStyle: true
            });
        const command = new GetObjectCommand(inputLocationParams);
        const imageObject = await client.send(command);

        const stream = imageObject.Body as Readable

        const streamToBuffer = (stream: Readable) => new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = []
            stream.on('data', chunk => chunks.push(chunk))
            stream.once('end', () => resolve(Buffer.concat(chunks)))
            stream.once('error', reject)
        })

        const image = await streamToBuffer(stream)
        let editedImage = sharp(image);

        if (imageParams.width != undefined && imageParams.height != undefined) {
            editedImage = editedImage.resize({
                height: parseInt(imageParams.height),
                width: parseInt(imageParams.width),
            })
            newName = newName + imageParams.height + 'x' + imageParams.width
        }

        if (imageParams.format && SUPPORTED_OUTPUT.includes(imageParams.format)) {
            let format = imageParams.format
            editedImage = editedImage.toFormat(format as keyof (FormatEnum))
            newName = newName + '.' + imageParams.format
        } else {
            newName = newName + '.' + params.Key.split('.')[1]
        }

        console.log('4')
        const imageBuffer = await editedImage.toBuffer();
        console.log('-------------------------------------')
        console.log(imageBuffer)

        const putObjectCommand = new PutObjectCommand({
            Bucket: 'huytatest',
            Body: imageBuffer,
            Key: newName
        });

        const data = await client.send(putObjectCommand)

        console.log('-------------------------------------')
        console.log(data)
        console.log(newName)

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };

    } catch (e) {
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