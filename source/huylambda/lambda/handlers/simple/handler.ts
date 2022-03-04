import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDB} from "@aws-sdk/client-dynamodb";
import S3 from "aws-sdk/clients/s3";
import sharp from "sharp";

export const handler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    let image;
    try {
        // const dynamoClient = new DynamoDB({})
        const s3Client = new S3({})
        // let params = {
        //     Item: {
        //         "ID": {
        //             S: "3"
        //         },
        //         "AlbumTitle": {
        //             S: "Somewhat Famous"
        //         },
        //         "Artist": {
        //             S: "No One You Know"
        //         },
        //         "SongTitle": {
        //             S: "Call Me Today"
        //         }
        //     },
        //     TableName: "huytatest"
        // };
        //
        // await dynamoClient.putItem(params)
        const imageLocation = {
            Bucket: 'huytatest',
            Key: 'kremlin.jpg'
        }
        const originalImage = await s3Client.getObject(imageLocation).promise();
        const imageBuffer = Buffer.from(originalImage.Body as Uint8Array);
        const metadata = await sharp(imageBuffer, {failOnError: false}).metadata();
        const resizeOptions = {
            width: 200,
            height: 200
        }
        const resizedImage = await sharp(imageBuffer).resize(resizeOptions).toBuffer()
        const data = await s3Client.putObject({
            Bucket: 'huytatest',
            Key: 'output.jpg',
            Body: resizedImage as Uint8Array
        }).promise()

        console.log(data)

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Inserted successfully!',
            }),
        };

    } catch
        (e) {
        console.error(e);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
    return response
}