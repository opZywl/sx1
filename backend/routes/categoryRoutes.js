const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdminUser = require("../middleware/fetchAdminUser");
const isAdmin = require("../middleware/AdminVerify");
const Category = require("../models/Category.model");

// Get all categories (public - for navbar)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("[Categories] Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all categories (admin - including inactive)
router.get("/admin", fetchAdminUser, isAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("[Categories] Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get category by slug
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("[Categories] Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new category
router.post(
  "/",
  fetchAdminUser,
  isAdmin,
  [
    body("name").isString().isLength({ min: 1 }).withMessage("Category name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, order, groups, isActive } = req.body;

      // Check if category already exists
      const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existing) {
        return res.status(400).json({ error: "Category already exists" });
      }

      const category = await Category.create({
        name,
        order: order || 0,
        groups: groups || [],
        isActive: isActive !== undefined ? isActive : true,
      });

      console.log("[Categories] Created:", category.name);
      res.status(201).json({ success: true, category });
    } catch (error) {
      console.error("[Categories] Error:", error.message);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

// Update category
router.put(
  "/:id",
  fetchAdminUser,
  isAdmin,
  async (req, res) => {
    try {
      const { name, order, groups, isActive } = req.body;

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, order, groups, isActive, updatedAt: new Date() },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      console.log("[Categories] Updated:", category.name);
      res.status(200).json({ success: true, category });
    } catch (error) {
      console.error("[Categories] Error:", error.message);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

// Add group to category
router.post(
  "/:id/groups",
  fetchAdminUser,
  isAdmin,
  [
    body("name").isString().isLength({ min: 1 }).withMessage("Group name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, order, items } = req.body;

      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      category.groups.push({
        name,
        order: order || category.groups.length,
        items: items || [],
      });

      await category.save();

      console.log("[Categories] Added group to:", category.name);
      res.status(200).json({ success: true, category });
    } catch (error) {
      console.error("[Categories] Error:", error.message);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

// Add item to group
router.post(
  "/:id/groups/:groupIndex/items",
  fetchAdminUser,
  isAdmin,
  [
    body("name").isString().isLength({ min: 1 }).withMessage("Item name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, order } = req.body;
      const groupIndex = parseInt(req.params.groupIndex);

      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (!category.groups[groupIndex]) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Generate slug for item
      const slug = name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      category.groups[groupIndex].items.push({
        name,
        slug,
        order: order || category.groups[groupIndex].items.length,
      });

      await category.save();

      console.log("[Categories] Added item to group:", name);
      res.status(200).json({ success: true, category });
    } catch (error) {
      console.error("[Categories] Error:", error.message);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

// Delete category
router.delete(
  "/:id",
  fetchAdminUser,
  isAdmin,
  async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      console.log("[Categories] Deleted:", category.name);
      res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
      console.error("[Categories] Error:", error.message);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

// Seed default categories (Nike-style)
router.post("/seed", fetchAdminUser, isAdmin, async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: "Masculino",
        order: 1,
        groups: [
          {
            name: "Calçados",
            order: 1,
            items: [
              { name: "Tênis", slug: "tenis", order: 1 },
              { name: "Casual", slug: "casual", order: 2 },
              { name: "Corrida", slug: "corrida", order: 3 },
              { name: "Chuteiras", slug: "chuteiras", order: 4 },
              { name: "Basquete", slug: "basquete", order: 5 },
            ],
          },
          {
            name: "Roupas",
            order: 2,
            items: [
              { name: "Camisetas", slug: "camisetas", order: 1 },
              { name: "Shorts", slug: "shorts", order: 2 },
              { name: "Calças", slug: "calcas", order: 3 },
              { name: "Jaquetas", slug: "jaquetas", order: 4 },
            ],
          },
          {
            name: "Acessórios",
            order: 3,
            items: [
              { name: "Bonés", slug: "bones", order: 1 },
              { name: "Mochilas", slug: "mochilas", order: 2 },
              { name: "Meias", slug: "meias", order: 3 },
            ],
          },
        ],
      },
      {
        name: "Feminino",
        order: 2,
        groups: [
          {
            name: "Calçados",
            order: 1,
            items: [
              { name: "Tênis", slug: "tenis", order: 1 },
              { name: "Casual", slug: "casual", order: 2 },
              { name: "Corrida", slug: "corrida", order: 3 },
            ],
          },
          {
            name: "Roupas",
            order: 2,
            items: [
              { name: "Tops", slug: "tops", order: 1 },
              { name: "Leggings", slug: "leggings", order: 2 },
              { name: "Shorts", slug: "shorts", order: 3 },
            ],
          },
        ],
      },
      {
        name: "Lançamentos",
        order: 3,
        groups: [],
      },
      {
        name: "Ofertas",
        order: 4,
        groups: [],
      },
    ];

    // Clear existing categories and seed
    await Category.deleteMany({});
    const categories = await Category.insertMany(defaultCategories);

    console.log("[Categories] Seeded default categories");
    res.status(201).json({ success: true, categories });
  } catch (error) {
    console.error("[Categories] Seed error:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

module.exports = router;
