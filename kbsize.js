const { Blob } = require('buffer');
const legacyBlob = require('cross-blob');

const sizeInKB = str => {
  let blob;
  try {
    blob = new Blob([str]);
  } catch (err) {
    blob = new legacyBlob([str]);
  }
  const sizeInBytes = blob.size;
  const sizeInKilobytes = sizeInBytes / 1024;
  return sizeInKilobytes;
}

module.exports = sizeInKB;
