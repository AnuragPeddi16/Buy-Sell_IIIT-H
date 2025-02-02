const express = require('express');
const userRoutes = require('./routers/userRoutes');
const itemRoutes = require('./routers/itemRoutes');
const orderRouter = require('./routers/orderRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/orders', orderRouter);

module.exports = router;