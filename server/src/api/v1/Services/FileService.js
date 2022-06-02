const { unlink } = require("fs/promises");
async function DeleteFile(filePath) {
  await unlink(filePath);
}
module.exports={DeleteFile}