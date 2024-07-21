const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  updateOrderStatus, 
  updateOrderItems, 
  getAllOrders, 
  getUserOrders, 
  updateDeliveryMode, 
  updateOrderDeliveryOption 
} = require('../controllers/orderController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.post('/', isAuthenticated, createOrder);
router.put('/:id/status', isAuthenticated, updateOrderStatus);
router.put('/:id/items', isAuthenticated, updateOrderItems);
router.get('/', isAuthenticated, getAllOrders);
router.get('/me', isAuthenticated, getUserOrders);
router.put('/update-delivery-mode', isAuthenticated, updateDeliveryMode);
router.put('/:id/delivery-option', isAuthenticated, updateOrderDeliveryOption);

module.exports = router;
