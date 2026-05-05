const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, action } = req.body;
    let cartItem = await Cart.findOne({ user: req.user.id, product: productId });
    
    if (cartItem) {
      if (action === 'update') {
        cartItem.quantity = quantity;
      } else {
        cartItem.quantity += quantity || 1;
      }
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ user: req.user.id, product: productId, quantity: quantity || 1 });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user.id }).populate('product');
    const totalPrice = cartItems.reduce((acc, item) => {
      return acc + (item.product ? item.product.price * item.quantity : 0);
    }, 0);
    res.json({ items: cartItems, totalPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};