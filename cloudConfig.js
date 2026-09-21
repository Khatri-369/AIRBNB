const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Create Storage Instance
const storage = new CloudinaryStorage({
    params: {
        folder: "wanderlust_DEV",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image",
    },
});

module.exports = {
    storage,
};