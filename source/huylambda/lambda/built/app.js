"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const sharp_1 = __importDefault(require("sharp"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    let image;
    try {
        // const dynamoClient = new DynamoDB({})
        const s3Client = new s3_1.default({});
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
        };
        const originalImage = yield s3Client.getObject(imageLocation).promise();
        const imageBuffer = Buffer.from(originalImage.Body);
        const metadata = yield (0, sharp_1.default)(imageBuffer, { failOnError: false }).metadata();
        const resizeOptions = {
            width: 200,
            height: 200
        };
        const resizedImage = yield (0, sharp_1.default)(imageBuffer).resize(resizeOptions).toBuffer();
        const data = yield s3Client.putObject({
            Bucket: 'huytatest',
            Key: 'output.jpg',
            Body: resizedImage
        }).promise();
        console.log(data);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Inserted successfully!',
            }),
        };
    }
    catch (e) {
        console.error(e);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
    return response;
});
exports.handler = handler;
//# sourceMappingURL=app.js.map