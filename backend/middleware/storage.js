const multer = require("multer");

// Use memory storage to store the file in memory as a Buffer
// Then we'll upload to Cloudinary for permanent storage
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only! (jpeg, jpg, png, gif, webp)"));
  }
}

// Initialize upload with memory storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 20000000 }, // limit file size to 20MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("file");

module.exports = upload;
