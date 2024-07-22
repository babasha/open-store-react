// routes/index.js
const express = require('express');
const controllers = require('../controllers');
const { isAuthenticated, isAdmin, upload } = require('../middlewares');

const router = express.Router();

// Маршруты для продуктов
router.get('/products', controllers.getProducts);
router.post('/products', upload.single('image'), isAdmin, controllers.addProduct);
router.put('/products/:id', upload.single('image'), isAdmin, controllers.updateProduct);
router.delete('/products/:id', isAdmin, controllers.deleteProduct);

// Маршруты для курьеров
router.get('/couriers', isAuthenticated, controllers.getCouriers);
router.get('/couriers/me', isAuthenticated, controllers.getCourier);
router.put('/couriers/me/status', isAuthenticated, controllers.updateCourierStatus);

// Маршруты для заказов
router.post('/orders', isAuthenticated, controllers.createOrder);
router.put('/orders/:id/status', isAuthenticated, controllers.updateOrderStatus);
router.get('/orders', isAuthenticated, controllers.getOrders);
router.get('/api/orders/me', isAuthenticated, controllers.getUserOrders);

// Маршруты для аутентификации и пользователей
router.post('/auth/register', controllers.registerUser);
router.post('/auth/login', controllers.loginUser);
router.get('/auth/me', isAuthenticated, controllers.getCurrentUser);
router.put('/users/:id', isAuthenticated, controllers.updateUser);
router.get('/users', isAuthenticated, controllers.getUsers);
router.put('/users/:id/role', isAdmin, controllers.updateUserRole);

// Дополнительные маршруты
// Например, маршруты для обновления информации о доставке, назначение курьеров и т.д.

module.exports = router;
