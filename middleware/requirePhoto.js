const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "C:/Users/Public/Documents/greenguard/src/CenterManagement/images");
  },
  filename: function (req, file, cb) {
    return cb(null, ` ${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
