const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "playon_turfs",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Multer file upload handler
const upload = multer({ storage });

module.exports = upload;
