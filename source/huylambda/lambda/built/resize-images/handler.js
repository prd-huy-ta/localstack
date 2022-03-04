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
exports.imageResizeHandler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const sharp_1 = __importDefault(require("sharp"));
const imageResizeHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        let image;
        const body = event.queryStringParameters || {};
        const inputLocationParams = {
            Bucket: body.Bucket,
            Key: body.Key
        };
        const resizeParams = {
            width: parseInt(body.width || '200'),
            height: parseInt(body.height || '200'),
        };
        const outputLocationParams = {
            Bucket: body.Bucket,
            Key: body.output
        };
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
        image = yield streamToBuffer(stream);
        const resizedImage = yield (0, sharp_1.default)(image).resize(resizeParams).toBuffer();
        const putObjectCommand = new client_s3_1.PutObjectCommand(Object.assign(Object.assign({}, outputLocationParams), { Body: resizedImage }));
        const data = yield client.send(putObjectCommand);
        console.log(data);
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
exports.imageResizeHandler = imageResizeHandler;
//# sourceMappingURL=handler.js.map