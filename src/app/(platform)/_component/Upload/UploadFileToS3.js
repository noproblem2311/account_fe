'use client'
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


const REGION = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION;
const ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
// Create S3 client with the specified region and credentials
const client =  new S3Client({
  region: REGION ,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY ,
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
