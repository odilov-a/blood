const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const outputPath = `${process.cwd()}/files/`;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, outputPath);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  },
});

const uploadMiddleware = multer({ storage: storage }).single("file");

const uploadFile = (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    next();
  });
};

module.exports = uploadFile;