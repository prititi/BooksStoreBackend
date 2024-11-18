import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.AWS_SECRET_KEY as string,
  endpoint: process.env.WASABI_ENDPOINT as string,
  s3ForcePathStyle: true,
});

export default s3;
