import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
import multer from "multer";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const wasabiEndpoint = new AWS.Endpoint("s3.us-east-2.wasabisys.com");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  endpoint: wasabiEndpoint,
  s3ForcePathStyle: true,
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(__dirname, "../uploads");
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

const uploadMiddleware = upload.single("file");

// Helper function to create a presigned URL
const createNewPresignedUrl = async (
  key: string,
  fileType: string
): Promise<string> => {
  const params = {
    Bucket: process.env.WASABI_BUCKET_NAME!,
    Key: key + fileType,
    Expires: 7200,
  };

  try {
    const url = await s3.getSignedUrlPromise("getObject", params);
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return "Error generating signed URL";
  }
};

// Controller function for handling file uploads
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = file.path;
    const fileType = file.mimetype;
    const fileExtension = "." + fileType.split("/")[1];
    const fileName = path.parse(file.filename).name;

    const wasabiBucket = process.env.WASABI_BUCKET_NAME;

    if (!wasabiBucket) {
      return res.status(500).json({ error: "Bucket name is missing" });
    }

    const params = {
      Bucket: wasabiBucket,
      Key: file.filename,
      ContentType: fileType,
      Body: fs.readFileSync(filePath),
      ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();

    if (!uploadResult || !uploadResult.Location) {
      return res.status(500).json({ error: "Error uploading file" });
    }

    fs.unlinkSync(filePath);

    const url = `${process.env.BASE_URL}/api/static/${file.filename}`;
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return res
      .status(500)
      .json({ error: "Error handling file upload: " + error });
  }
};

// Controller function for generating a presigned URL for download
export const getPresignedUrl = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  let { id } = req.params;
  
  const parts = id.split(".");
  const fileType = parts.length > 1 ? "." + parts[parts.length - 1] : "";
  id = parts.slice(0, parts.length - 1).join(".");
  
  console.log("fileType", fileType);
  console.log("id", id);

  if (!id) {
    return res.status(400).json({ error: "Missing file key" });
  }

  try {
    const url = await createNewPresignedUrl(id, fileType);

    if (url && !url.startsWith("Error")) {
      return res.redirect(url);
    } else {
      return res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return res.status(500).json({ error: "Error generating presigned URL" });
  }
};


export { uploadMiddleware };
