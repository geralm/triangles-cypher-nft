
require("dotenv").config();

const pinata = require("./Pinata");
const {getFileData} = require("./utils");



async function main(filename) {
  try {
    // Validate the file
    const fileData = getFileData(filename);
    console.log(`📁 Preparing file: ${filename} -> ${JSON.stringify(fileData)}`);
    
    // Create blob and file
    console.log(`⏳ Uploading file to Pinata...`);
    
    // Upload file
    const upload = await pinata.uploadFile(
      fileData.filename,
      fileData.mimetype
    );
    console.log(`✅ ${fileData.filename} has been uploaded successfully to Pinata!`);
    console.log(`📋 Upload Details: ${JSON.stringify(upload)}`)

    
    return upload;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Get filename from command line arguments
const filename = process.argv[2];

if (!filename) {
  console.log(`
📖 Usage: node app.js <filename>

Examples:
  node app.js hello-world.txt
  node app.js document.pdf
  node app.js image.png
  node app.js project.zip
  `);
  process.exit(1);
}

main(filename);
