const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, placeOrder)
  .get(protect, getUserOrders);

router.route('/all').get(protect, admin, getAllOrders);

router.route('/:id')
  .put(protect, admin, updateOrderStatus)
  .delete(protect, deleteOrder);

module.exports = router;