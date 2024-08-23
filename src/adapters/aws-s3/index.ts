import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs';

import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
    }
});

export interface SendBucketProps {
    bucketName: string,
    key: string,
    filePath: string
}

export async function sendBucket({ bucketName, key, filePath }: SendBucketProps): Promise<string> {
    const fileStream = fs.createReadStream(filePath);

    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileStream,
            ContentType: 'image/jpeg'
        })
    );

    deleteLocalFile(filePath);

    return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

export function deleteLocalFile(filePath: string) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Erro ao deletar o arquivo local: ${err.message}`);
        } else {
            console.log(`Arquivo local deletado: ${filePath}`);
        }
    });
}

export default s3Client;