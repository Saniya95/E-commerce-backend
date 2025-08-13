const userModel = require("../models/usermodel");
const product = require("../models/product");
const mongoose = require("mongoose");

// ✅ Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate the product ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const user = await userModel.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Check if product exists
    const productExists = await product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingItem = user.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    await user.save();
    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

// ✅ Get cart page with populated products
exports.getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("cart.product");

    // calculate total
    const cartItems = user.cart || [];
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
    const delivery = 50;
    const total = subtotal + delivery;

    // Return JSON response for API
    res.json({
      success: true,
      items: cartItems,
      subtotal,
      delivery,
      total,
    });
  } catch (err) {
    console.error("❌ Error loading cart:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load cart",
    });
  }
};

// ✅ Remove from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const user = await userModel.findById(req.user.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  user.cart = user.cart.filter((item) => item.product.toString() !== productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
  });
};

// ✅ Update cart quantity
exports.updateCartQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const user = await userModel.findById(req.user.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const item = user.cart.find((i) => i.product.toString() === productId);
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Item not found in cart" });

  item.quantity = Number(quantity);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Cart quantity updated successfully",
  });
};
