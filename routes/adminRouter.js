const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const upload = require("../utils/multer");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");

// Show Add Product Form
router.get(
  "/products/add",
  verifyUser,
  verifyAdmin,
  adminController.getAddProductPage
);

// Handle Form Submission
router.post(
  "/add-product",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  adminController.createProduct
);

// Update Category Image
router.put(
  "/categories/:slug/image",
  verifyUser,
  verifyAdmin,
  adminController.updateCategoryImage
);

module.exports = router;
