const fs = require("fs");
const path = require("path");

const mimeTypes = {
  ".txt": "text/plain",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

const getFileType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return mimeTypes[ext];
}

const getFileData = (filename) => {
  if (!filename) {
    throw new Error("❌ Error: You must provide a filename");
  }

  if (!fs.existsSync(filename)) {
    throw new Error(`❌ Error: The file "${filename}" does not exist`);
  }

  const stats = fs.statSync(filename);
  if (!stats.isFile()) {
    throw new Error(`❌ Error: "${filename}" is not a valid file`);
  }

  return {
    filename: filename, 
    mimetype: getFileType(filename),
    size: stats.size
  }
};

module.exports = {
    getFileData
}