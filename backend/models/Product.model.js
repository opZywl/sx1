const { Schema, model, models } = require("mongoose");

// Validate that imageUrl is a proper HTTPS URL (Cloudinary)
const validateImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  // Must be HTTPS URL from Cloudinary
  if (url.startsWith("blob:")) return false;
  if (!url.startsWith("https://")) return false;
  return true;
};

// Size schema for individual size stock tracking
const SizeSchema = new Schema({
  size: { type: String, required: true }, // e.g., "P", "M", "G", "GG", "38", "40", "42"
  stock: { type: Number, required: true, min: 0, default: 0 },
}, { _id: false });

// Color variant schema
const ColorVariantSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Azul", "Vermelho"
  hexCode: { type: String }, // e.g., "#FF0000"
  images: [{ type: String }], // Images specific to this color
}, { _id: false });

// Image schema for multiple images
const ImageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String },
  isMain: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { _id: false });

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // Pricing
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 }, // For showing discount
  // Category info
  category: { type: String, required: true }, // Main category slug
  subcategory: { type: String }, // Subcategory slug
  gender: { type: String, enum: ["masculino", "feminino", "unissex", "infantil"], default: "unissex" },
  // Stock - total (legacy support)
  stock: { type: Number, required: true, min: 0 },
  // Size-specific stock
  sizes: [SizeSchema],
  // Color variants
  colors: [ColorVariantSchema],
  // Multiple images
  images: [ImageSchema],
  // Legacy single image (for backwards compatibility)
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        // Allow empty/null for products using new images array
        if (!v) return true;
        return validateImageUrl(v);
      },
      message: "Image URL must be a valid HTTPS URL (not blob: or local path)"
    }
  },
  // Hash of the image content for deduplication and tracking
  imageHash: { type: String, index: true },
  // Cloudinary public_id for management
  imagePublicId: { type: String },
  // Featured position on home page (1, 2, or 3) - null means not featured
  featuredPosition: { type: Number, min: 1, max: 3, default: null },
  // Tags for filtering
  tags: [{ type: String }],
  // Is this a new arrival / on sale?
  isNewArrival: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  variations: [{ type: Schema.Types.ObjectId, ref: 'Variation' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Virtual to get main image URL (first image or legacy imageUrl)
ProductSchema.virtual('mainImage').get(function() {
  if (this.images && this.images.length > 0) {
    const mainImg = this.images.find(img => img.isMain) || this.images[0];
    return mainImg.url;
  }
  return this.imageUrl || '';
});

// Ensure virtuals are included in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

// Pre-save hook
ProductSchema.pre("save", function(next) {
  // Validate legacy imageUrl if provided
  if (this.imageUrl && !validateImageUrl(this.imageUrl)) {
    const error = new Error("Invalid image URL: must be HTTPS, not blob: or local");
    return next(error);
  }
  // Calculate total stock from sizes if sizes are provided
  if (this.sizes && this.sizes.length > 0) {
    this.stock = this.sizes.reduce((total, size) => total + size.stock, 0);
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
