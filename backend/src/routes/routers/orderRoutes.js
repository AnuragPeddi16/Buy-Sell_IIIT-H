const express = require('express');
const authToken = require('../../utils/authToken');

const {
    getAllOrdersbyUser,
    getPendingOrders,
    addnewOrders,
    markOrderAsCompleted
} = require('../../controllers/orderController');

const router = express.Router();

router.get('/all', authToken, getAllOrdersbyUser); // GET /api/orders/all
router.get('/pending', authToken, getPendingOrders); // GET /api/orders/pending
router.post('/add', authToken, addnewOrders); // POST /api/orders/add
router.post('/:orderId/complete', authToken, markOrderAsCompleted); // DELETE /api/orders/:orderId/complete

module.exports = router;