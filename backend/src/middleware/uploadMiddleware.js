const multer = require("multer");
const { cloudinary } = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "turf_images",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 1000, height: 750, crop: "limit" }],
  },
});

// Local storage for temporary files (in case of Cloudinary direct upload issues)
const localStorageFallback = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer file upload handler
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
