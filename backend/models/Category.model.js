const { Schema, model, models } = require("mongoose");

const CategorySchema = new Schema({
  // Main menu item: "Masculino", "Feminino", "Lançamentos", "Ofertas", etc.
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  // Display order in navbar
  order: { type: Number, default: 0 },
  // Is this category visible in navbar?
  isActive: { type: Boolean, default: true },
  // Subcategory groups (e.g., "Calçados", "Roupas", "Esportes", "Coleções")
  groups: [{
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
    // Items within each group (e.g., "Tênis", "Casual", "Corrida")
    items: [{
      name: { type: String, required: true },
      slug: { type: String, required: true },
      order: { type: Number, default: 0 },
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate slug from name
CategorySchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  this.updatedAt = new Date();
  next();
});

module.exports = models.Category || model("Category", CategorySchema);
