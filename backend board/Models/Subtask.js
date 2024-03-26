// Subtask.js

const fileType = require('file-type');

// Validate file type and size
const validateFile = async (file) => {
    const type = await fileType.fromBuffer(file.buffer);
    if (!type) {
        throw new Error('Invalid file type');
    }
    if (file.size > 10 * 1024 * 1024) { // Limit to 10MB
        throw new Error('File size exceeds limit');
    }
};

module.exports = {
    validateFile
};
