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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    let params = { Bucket: 'huytatest', Key: 'test.csv' };
    let s3Client;
    const command = new client_s3_1.PutObjectCommand(params);
    s3Client = new client_s3_1.S3Client({ "endpoint": "http://localhost:4566" });
    const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
    console.log('The URL is', url);
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Get S3-Signed-URL successfully!',
            url: url
        }),
    };
    return response;
});
exports.handler = handler;
//# sourceMappingURL=handler.js.map