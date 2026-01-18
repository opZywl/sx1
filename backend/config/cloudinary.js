const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");

// Log Cloudinary configuration status (without exposing secrets)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("[Cloudinary] Configuration check:", {
  cloud_name: cloudName ? `${cloudName.substring(0, 4)}...` : "MISSING",
  api_key: apiKey ? `${apiKey.substring(0, 4)}...` : "MISSING",
  api_secret: apiSecret ? "SET" : "MISSING",
});

if (!cloudName || !apiKey || !apiSecret) {
  console.error("[Cloudinary] ERROR: Missing required environment variables!");
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Generate a unique hash from image buffer for deduplication and tracking
const generateImageHash = (fileBuffer) => {
  return crypto.createHash("sha256").update(fileBuffer).digest("hex").substring(0, 16);
};

// Upload image buffer to Cloudinary with content-based hash
const uploadToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    // Generate hash from image content for unique identification
    const imageHash = generateImageHash(fileBuffer);
    const timestamp = Date.now();
    const publicId = `product-${imageHash}-${timestamp}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "sx1-products",
        public_id: publicId,
        resource_type: "image",
        // Ensure image is stored permanently
        type: "upload",
        // Add tags for easier management
        tags: ["product", "sx1"],
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Upload error:", error);
          reject(error);
        } else {
          // Add the hash to the result for database storage
          result.imageHash = imageHash;
          console.log("[Cloudinary] Upload success:", {
            publicId: result.public_id,
            url: result.secure_url,
            hash: imageHash,
          });
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Validate if a URL is a valid Cloudinary URL
const isValidCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  // Must be HTTPS and from Cloudinary
  return url.startsWith("https://res.cloudinary.com/") ||
         url.startsWith("https://res-");
};

module.exports = { cloudinary, uploadToCloudinary, generateImageHash, isValidCloudinaryUrl };
