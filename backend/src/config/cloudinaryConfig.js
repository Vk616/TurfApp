const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a single image to Cloudinary
const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "PlayOnTurf",
      use_filename: true,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

// Upload multiple images to Cloudinary
const uploadMultipleImages = async (imagePaths) => {
  try {
    const uploadPromises = imagePaths.map(path => 
      cloudinary.uploader.upload(path, {
        folder: "PlayOnTurf",
        use_filename: true,
      })
    );
    
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  } catch (error) {
    console.error("Error uploading multiple images to Cloudinary:", error);
    throw new Error("Failed to upload images");
  }
};

// Delete an image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from the URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (!publicId) return;
    
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
};

// Helper function to extract public_id from cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // For URLs like: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/PlayOnTurf/image_name.jpg
    const urlParts = url.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    
    // Get folder path if it exists
    let folderPath = '';
    const versionIndex = url.indexOf('/v');
    if (versionIndex !== -1) {
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex !== -1) {
        folderPath = url.substring(uploadIndex + 8, url.lastIndexOf('/'));
        if (folderPath.startsWith('v')) {
          // Remove version prefix
          const versionEndIndex = folderPath.indexOf('/');
          if (versionEndIndex !== -1) {
            folderPath = folderPath.substring(versionEndIndex + 1);
          } else {
            folderPath = '';
          }
        }
      }
    }
    
    // Get filename without extension
    const fileName = fileNameWithExtension.split('.')[0];
    
    // Combine folder path and filename
    return folderPath ? `${folderPath}/${fileName}` : fileName;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

module.exports = { 
  cloudinary, 
  uploadImage, 
  uploadMultipleImages, 
  deleteImage 
};
