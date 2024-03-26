const multer = require('multer');

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
    cb(null, 'uploads/'); // This is the folder where the files will be stored
 },
 filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
 }
});

const upload = multer({ storage: storage });

module.exports = upload;
