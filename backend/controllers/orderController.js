const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ✅ Place Order
exports.placeOrder = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user.id }).populate('product');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const products = [];

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}. Available: ${item.product.stock}`
        });
      }

      totalAmount += item.product.price * item.quantity;

      products.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.imageUrl,
        quantity: item.quantity
      });
    }

    const order = new Order({
      user: req.user.id,   // ✅ Correct
      products,
      totalAmount
    });

    await order.save();

    // 🔻 Reduce stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // 🔻 Clear cart
    await Cart.deleteMany({ user: req.user.id });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Logged-in User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({ path: 'products.product' })
      .lean();   // 🔥 Important fix

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: 'user', select: 'name email' })   // ✅ ensure user data
      .populate({ path: 'products.product' })
      .lean();   // 🔥 IMPORTANT FIX

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔒 Authorization check
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // 🔻 Restore stock
    for (const item of order.products) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order deleted and stock restored' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
