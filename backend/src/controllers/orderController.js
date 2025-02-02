const Order = require("../models/Order");
/* const Item = require("../models/Item"); */
const bcrypt = require('bcryptjs');
const errorWrapper = require('../utils/errorWrapper');

// get details of all orders placed/received by a user (except yet to be delivered ones)
const getAllOrdersbyUser = async (req, res) => {

    const userid = req.user.id;

    const pendingOrders = await Order.find({ buyer: userid, status: 'pending' })
                                    .populate('item', 'name price')
                                    .populate('seller', 'fname lname')
                                    .lean();

    const boughtOrders = await Order.find({ buyer: userid, status: 'completed' })
                                    .populate('item', 'name price')
                                    .populate('seller', 'fname lname')
                                    .lean();

    const soldOrders = await Order.find({ seller: userid, status: 'completed' })
                                    .populate('item', 'name price')
                                    .populate('buyer', 'fname lname')
                                    .lean();
      
    res.json({
        pending: pendingOrders,
        bought: boughtOrders,
        sold: soldOrders
    });

}

// get details of all orders yet to be delivered by user
const getPendingOrders = async (req, res) => {

    const userid = req.user.id;

    const pendingOrders = await Order.find({ seller: userid, status: 'pending' })
                                    .populate('item', 'name price')
                                    .populate('buyer', 'fname lname')
                                    .lean();
      
    res.json(pendingOrders);

}

const addnewOrders = async (req, res) => {

    const orders = req.body;
    const buyerid = req.user.id;

    for (const order of orders) {

        order.buyer = buyerid;
        order.otp = await bcrypt.hash(order.otp, 10);

    }

    const result = await Order.insertMany(orders); // inserts all valid orders
    res.json(result);

};

// mark as completed if otp matches
const markOrderAsCompleted = async (req, res) => {

    const orderid = req.params.orderId;
        
    const order = await Order.findById(orderid).lean();
    const hashedOTP = order.otp;
    const enteredOTP = req.body.otp;
    const checkOTP = await bcrypt.compare(enteredOTP, hashedOTP);

    if (checkOTP) {

        const updatedOrder = await Order.findByIdAndUpdate(orderid, { status: "completed" }, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        
        res.status(200).json(updatedOrder);

    } else res.status(401).json({message: 'Invalid OTP'});

}

module.exports = {
    getAllOrdersbyUser: errorWrapper(getAllOrdersbyUser),
    getPendingOrders: errorWrapper(getPendingOrders),
    addnewOrders: errorWrapper(addnewOrders),
    markOrderAsCompleted: errorWrapper(markOrderAsCompleted)
};