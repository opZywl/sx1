const { Schema, model, models } = require("mongoose");

// Validate that imageUrl is a proper HTTPS URL (Cloudinary)
const validateImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  // Must be HTTPS URL from Cloudinary
  if (url.startsWith("blob:")) return false;
  if (!url.startsWith("https://")) return false;
  return true;
};

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: validateImageUrl,
      message: "Image URL must be a valid HTTPS URL (not blob: or local path)"
    }
  },
  // Hash of the image content for deduplication and tracking
  imageHash: { type: String, index: true },
  // Cloudinary public_id for management
  imagePublicId: { type: String },
  variations: [{ type: Schema.Types.ObjectId, ref: 'Variation', required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to ensure imageUrl is valid before saving
ProductSchema.pre("save", function(next) {
  if (this.imageUrl && !validateImageUrl(this.imageUrl)) {
    const error = new Error("Invalid image URL: must be HTTPS, not blob: or local");
    return next(error);
  }
  this.updatedAt = new Date();
  next();
});

// Pre-update hook to validate imageUrl on updates
ProductSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  if (update.imageUrl && !validateImageUrl(update.imageUrl)) {
    const error = new Error("Invalid image URL: must be HTTPS, not blob: or local");
    return next(error);
  }
  update.updatedAt = new Date();
  next();
});

module.exports = models.Products || model("Products", ProductSchema);
