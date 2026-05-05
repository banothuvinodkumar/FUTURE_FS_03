const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:id')
  .delete(protect, removeFromCart);

module.exports = router;