const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  try {
    // Fetch cart items for the user securely from the database
    const cartItems = await Cart.find({ user: req.user.id }).populate('product');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total on the backend securely
    let totalAmount = 0;
    const products = [];

    // Check stock and build the products array for the order
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.product.name}. Available: ${item.product.stock}` });
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
      user: req.user.id,
      products,
      totalAmount
    });
    await order.save();

    // Deduct stock dynamically for each purchased product
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity } // Decrements the stock by the purchased quantity
      });
    }

    // Clear cart after order
    await Cart.deleteMany({ user: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure only the user who made the order (or an admin) can delete it
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // Restock the products
    for (const item of order.products) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted and stock restored' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
