const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");
const upload = require("../utils/multer"); // ✅ required
const Product = require("../models/product");
const Category = require("../models/category");

// GET products by category
router.get("/category/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const products = await Product.find({ category: category._id });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Add Product Page
router.get(
  "/add-product",
  verifyUser,
  verifyAdmin,
  adminController.getAddProductPage
);

// POST Add Product Form
router.post(
  "/add-product",
  verifyUser,
  verifyAdmin,
  upload.single("imageFile"),
  adminController.createProduct
);

module.exports = router;
