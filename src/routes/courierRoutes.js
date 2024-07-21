const express = require('express');
const router = express.Router();
const { getCouriers, getMyCourier, updateCourierStatus, getWorkingCouriers, assignCourierToOrder } = require('../controllers/courierController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', isAuthenticated, getCouriers);
router.get('/me', isAuthenticated, getMyCourier);
router.put('/me/status', isAuthenticated, updateCourierStatus);
router.get('/working', isAuthenticated, getWorkingCouriers);
router.put('/orders/:id/assign-courier', isAuthenticated, assignCourierToOrder);

module.exports = router;
