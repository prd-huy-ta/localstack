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
exports.imageHandler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const sharp_1 = __importDefault(require("sharp"));
const imageHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        const SUPPORTED_OUTPUT = ['jpg', 'jpeg', 'png'];
        const params = event.queryStringParameters || {};
        if (!params.Bucket || !params.Key) {
            throw new Error('You must specify a Bucket and a Key!');
        }
        const inputLocationParams = {
            Bucket: params.Bucket,
            Key: params.Key
        };
        const imageParams = {
            width: params.width || undefined,
            height: params.height || undefined,
            format: params.format || undefined
        };
        let newName = params.Key.split('.')[0];
        const client = new client_s3_1.S3Client({});
        const command = new client_s3_1.GetObjectCommand(inputLocationParams);
        const imageObject = yield client.send(command);
        const stream = imageObject.Body;
        const streamToBuffer = (stream) => new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.once('end', () => resolve(Buffer.concat(chunks)));
            stream.once('error', reject);
        });
        const image = yield streamToBuffer(stream);
        console.log('1');
        let editedImage = (0, sharp_1.default)(image);
        console.log('2');
        console.log(imageParams);
        console.log(imageParams.width != undefined && imageParams.height != undefined);
        if (imageParams.width != undefined && imageParams.height != undefined) {
            editedImage = editedImage.resize({
                height: parseInt(imageParams.height),
                width: parseInt(imageParams.width),
            });
            console.log('3');
            newName = newName + imageParams.height + 'x' + imageParams.width;
        }
        // if (imageParams.format && SUPPORTED_OUTPUT.includes(imageParams.format)) {
        //     let format = imageParams.format
        //     editedImage = editedImage.toFormat(format as keyof (FormatEnum))
        //     newName = newName + '.' + imageParams.format
        // } else {
        newName = newName + '.' + params.Key.split('.')[1];
        // }
        console.log('4');
        const imageBuffer = yield editedImage.toBuffer();
        console.log('-------------------------------------');
        console.log(imageBuffer);
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: 'huytatest',
            Body: imageBuffer,
            Key: newName
        });
        const data = yield client.send(putObjectCommand);
        console.log('-------------------------------------');
        console.log(data);
        console.log(newName);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };
    }
    catch (e) {
        console.error(e);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error happened!',
            }),
        };
    }
    return response;
});
exports.imageHandler = imageHandler;
//# sourceMappingURL=handler.js.map