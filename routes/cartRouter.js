const express = require("express");
const router = express.Router();

// 🛡️ Middlewares
const { verifyUser } = require("../middlewares/auth");
const { addToCartValidator } = require("../middlewares/validators");
const { validationResult } = require("express-validator");

// 📦 Controllers
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} = require("../controllers/cartController");

const { checkoutPage } = require("../controllers/checkoutController");
const { createOrder } = require("../controllers/paymentController");

// ✅ 1. Add to Cart with validation
router.post("/", verifyUser, addToCartValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: errors.array().map((e) => e.msg),
    });
  }
  await addToCart(req, res);
});

// ✅ 2. Get Cart
router.get("/", verifyUser, getCart);

// ✅ 3. Remove item from cart
router.post("/remove/:productId", verifyUser, (req, res, next) => {
  console.log(
    "Remove cart item request received for productId:",
    req.params.productId
  );
  removeFromCart(req, res);
});

// ✅ 4. Update cart item quantity
router.post("/update/:productId", verifyUser, (req, res, next) => {
  console.log(
    "Update cart quantity request received:",
    req.params.productId,
    req.body
  );
  updateCartQuantity(req, res);
});

// ✅ 5. Proceed to Checkout Page
router.get("/checkout", verifyUser, checkoutPage);

// ✅ 6. Create Razorpay order
router.post("/create-order", verifyUser, createOrder);

module.exports = router;
