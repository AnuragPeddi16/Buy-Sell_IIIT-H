const express = require('express');
const {authToken} = require('../../utils/authToken');

const {
    getAllOrdersbyUser,
    getPendingOrders,
    addnewOrders,
    regenerateOTP,
    markOrderAsCompleted
} = require('../../controllers/orderController');

const router = express.Router();

router.get('/all', authToken, getAllOrdersbyUser); // GET /api/orders/all
router.get('/pending', authToken, getPendingOrders); // GET /api/orders/pending
router.post('/add', authToken, addnewOrders); // POST /api/orders/add
router.get('/:orderId/regenerate', authToken, regenerateOTP); // GET /api/orders/:orderId/regenerate
router.post('/:orderId/complete', authToken, markOrderAsCompleted); // DELETE /api/orders/:orderId/complete

module.exports = router;