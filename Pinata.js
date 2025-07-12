require("dotenv").config({ path: `${process.cwd()}/.env` });

const { PinataSDK } = require("pinata");
const fs = require("fs");
const { Blob } = require("buffer");
const path = require("path");

if (!process.env.PINATA_JWT_ACCESS_TOKEN || !process.env.GATEWAY_URL) {
  throw new Error(
    "❌ Error: Pinata PINATA_JWT_ACCESS_TOKEN and GATEWAY_URL is required from .env"
  );
}

const pinataConfig = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT_ACCESS_TOKEN,
  pinataGateway: process.env.GATEWAY_URL,
});

const uploadFile = async (filename, fileType) => {
  if (!filename || !fileType)
    throw new Error("filename and fileType are required");
  const fileBaseName = path.basename(filename);
  const blob = new Blob([fs.readFileSync(filename)]);
  const file = new File([blob], fileBaseName, { type: fileType });
  console.log(`⏳ Uploading file to Pinata...`);
  const upload = await pinataConfig.upload.public.file(file);
  console.log(`✅ ${fileBaseName} have been uploaded succesfully to Pinata!`);
  return upload;
};

module.exports = {
  uploadFile,
};
