const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdminUser = require("../middleware/fetchAdminUser");
const isAdmin = require("../middleware/AdminVerify");
const Product = require("../models/Product.model");
const upload = require("../middleware/storage");
const Variation = require("../models/Variation.model");
const { uploadToCloudinary, isValidCloudinaryUrl } = require("../config/cloudinary");

const front_host = process.env.FRONTEND_HOST;

// Helper function to validate image URL before saving to database
const validateImageUrlForSave = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return { valid: false, error: "Image URL is required" };
  }
  if (imageUrl.startsWith("blob:")) {
    return { valid: false, error: "Cannot save blob URL - image upload incomplete" };
  }
  if (!imageUrl.startsWith("https://")) {
    return { valid: false, error: "Image URL must be HTTPS" };
  }
  return { valid: true };
};

router.post("/api/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("[Upload] Multer error:", err);
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    if (!req.file) {
      console.error("[Upload] No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("[Upload] Processing file:", req.file.originalname, "Size:", req.file.size);

    try {
      // Upload to Cloudinary for permanent storage
      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

      // Validate the result URL before returning
      if (!result.secure_url || !result.secure_url.startsWith("https://")) {
        console.error("[Upload] Invalid Cloudinary response:", result);
        return res.status(500).json({ error: "Invalid response from cloud storage" });
      }

      console.log("[Upload] Success:", {
        publicId: result.public_id,
        url: result.secure_url,
        hash: result.imageHash,
      });

      // Return the Cloudinary URL and hash - this is permanent and won't disappear
      res.json({
        filename: result.public_id,
        filepath: result.secure_url, // Cloudinary HTTPS URL
        imageHash: result.imageHash, // Content hash for tracking
        publicId: result.public_id,  // Cloudinary public ID
      });
    } catch (cloudinaryError) {
      console.error("[Upload] Cloudinary error:", cloudinaryError);
      return res.status(500).json({ error: "Failed to upload image to cloud storage" });
    }
  });
});

// add a product
router.post(
  "/addproduct",
  fetchAdminUser,
  isAdmin,
  [
    body("name").isString().isLength({ min: 1 }).withMessage("Product name is required"),
    body("description").isString().isLength({ min: 1 }).withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("category").isString().isLength({ min: 1 }).withMessage("Category is required"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("imageUrl").isString().isLength({ min: 1 }).withMessage("Image URL is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    // Validate image URL before proceeding
    const imageValidation = validateImageUrlForSave(req.body.imageUrl);
    if (!imageValidation.valid) {
      console.error("[AddProduct] Invalid image URL:", req.body.imageUrl, imageValidation.error);
      return res.status(400).json({ error: imageValidation.error });
    }

    try {
      let product = await Product.findOne({ name: req.body.name });
      if (product) {
        return res.status(400).json({ error: "Product name already exists" });
      }

      const body = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        imageUrl: req.body.imageUrl,
        // Store additional image metadata for tracking
        imageHash: req.body.imageHash || null,
        imagePublicId: req.body.imagePublicId || null,
      };

      console.log("[AddProduct] Creating product with image:", {
        name: body.name,
        imageUrl: body.imageUrl,
        imageHash: body.imageHash,
      });

      if (Array.isArray(req.body.variations) && req.body.variations.length > 0) {
        const variations = await Variation.find({
          type: { $in: req.body.variations },
        });
        body.variations = variations;
      } else {
        body.variations = [];
      }

      // Save the product with the validated image URL
      product = await Product.create(body);

      console.log("[AddProduct] Product created successfully:", product._id);

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("[AddProduct] Error:", error.message);
      res.status(500).json({ error: error.message || "internal server error" });
    }
  }
);

// update a product
router.put(
  "/updateproduct/:id",
  fetchAdminUser,
  isAdmin,
  [
    body("name")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Product name is required and should be a non-empty string."),
    body("description")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Product description is required and should be a non-empty string."),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price is required and should be a number greater than or equal to 0."),
    body("category")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Category is required and should be a non-empty string."),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock is required and should be an integer greater than or equal to 0."),
    body("imageUrl")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Image URL is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, category, stock, imageUrl, variations, imageHash, imagePublicId } = req.body;

    // Validate image URL before proceeding
    const imageValidation = validateImageUrlForSave(imageUrl);
    if (!imageValidation.valid) {
      console.error("[UpdateProduct] Invalid image URL:", imageUrl, imageValidation.error);
      return res.status(400).json({ error: imageValidation.error });
    }

    try {
      let product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      const body = {
        name,
        description,
        price,
        category,
        stock,
        imageUrl,
      };

      // Update image metadata if provided
      if (imageHash) body.imageHash = imageHash;
      if (imagePublicId) body.imagePublicId = imagePublicId;

      console.log("[UpdateProduct] Updating product:", {
        id,
        name,
        imageUrl,
        imageHash: imageHash || product.imageHash,
      });

      if (Array.isArray(variations) && variations.length > 0) {
        const updatedVariations = await Variation.find({
          type: { $in: variations },
        });
        if (updatedVariations.length <= 0) {
          return res.status(400).json({ error: "No matching variations found." });
        }
        body.variations = updatedVariations;
      }

      product = await Product.findByIdAndUpdate(id, body, { new: true });

      console.log("[UpdateProduct] Product updated successfully:", product._id);

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("[UpdateProduct] Error:", error.message);
      res.status(500).json({ error: error.message || "server error" });
    }
  }
);

//delete a product
router.delete(
  "/deleteproduct/:id",
  fetchAdminUser,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      // Check if the product exists
      let product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Delete the product
      await Product.findByIdAndDelete(id);

      res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// get products, 4 at a time
router.get("/productslist", async (req, res) => {
  try {
    const page = req.header("Page");
    const pageSize = page ? 4 : null;

    const filter = req.header("Filter");
    const sortBy = req.header("Sort");

    // Define a query object
    const query = {};

    // Only add filtering logic if a filter is provided
    if (filter) {
      query.$or = [
        { category: { $regex: new RegExp(`^${filter}$`, "i") } }, // Match category
      ];
    }

    let sortOptions = {};

    switch (sortBy) {
      case "latest":
        sortOptions = { createdAt: -1 };
        break;

      case "high":
        sortOptions = { price: -1 };
        break;

      case "low":
        sortOptions = { price: 1 };
        break;

      default:
        sortOptions = { createdAt: 1 };
        break;
    }

    // Fetch products with optional pagination
    const products = await Product.find(query)
      .skip(page ? (page - 1) * pageSize : 0)
      .limit(pageSize || 0)
      .sort(sortOptions || {})
      .populate('variations')

    // Get total count of products (use the same filter query for accurate count)
    const totalCount = await Product.countDocuments(query);

    res.status(200).json({ success: true, products, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get a product by id
router.post("/getproductbyid", async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findById(id).populate('variations')
    if (!product) throw new Error();
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
  }
});

// Get featured products for home page
router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({
      featuredPosition: { $in: [1, 2, 3] }
    })
    .sort({ featuredPosition: 1 })
    .populate('variations');

    res.status(200).json({ success: true, products: featuredProducts });
  } catch (error) {
    console.error("[Featured] Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Set featured position for a product
router.put(
  "/setfeatured/:id",
  fetchAdminUser,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { position } = req.body; // position can be 1, 2, 3, or null to remove

    try {
      // Validate position
      if (position !== null && ![1, 2, 3].includes(position)) {
        return res.status(400).json({ error: "Position must be 1, 2, 3, or null" });
      }

      // Find the product
      let product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // If setting a position (not removing), clear that position from any other product
      if (position !== null) {
        await Product.updateMany(
          { featuredPosition: position, _id: { $ne: id } },
          { $set: { featuredPosition: null } }
        );
      }

      // Update the product's featured position
      product = await Product.findByIdAndUpdate(
        id,
        { featuredPosition: position },
        { new: true }
      ).populate('variations');

      console.log("[SetFeatured] Product featured position updated:", {
        id: product._id,
        name: product.name,
        position: product.featuredPosition,
      });

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("[SetFeatured] Error:", error.message);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

module.exports = router;
