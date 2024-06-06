'use client'
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";



// Create S3 client with the specified region and credentials
const client =  new S3Client({
  region: process.env.AWS_BUCKET_REGION ,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ,
  },
})

const userid = "12345678";

export const PutObjectToS3 = async (fileList) => {
  try {
    for (const file of fileList) {
      const datetime = new Date().toISOString().slice(0, 10);
      const command = new PutObjectCommand({
        Bucket: "accountfolderpublic",
        Key: `${userid}/${file.name}`,
        Body: file,
      });

      try {
        const response = await client.send(command);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};
