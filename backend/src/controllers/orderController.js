const Order = require("../models/Order");
const User = require("../models/User");
const Item = require("../models/Item");
const bcrypt = require('bcryptjs');
const errorWrapper = require('../utils/errorWrapper');

const getIdfromEmail = async (email) => {

    const user = await User.findOne({ email: email }).lean();
    return user._id;

}

// get details of all orders placed/received by a user (except yet to be delivered ones)
const getAllOrdersbyUser = async (req, res) => {

    const userid = await getIdfromEmail(req.user.email);

    const pendingOrders = await Order.find({ buyer: userid, status: 'pending' })
                                    .populate('items', '_id name price')
                                    .populate('seller', 'fname lname')
                                    .lean();

    const boughtOrders = await Order.find({ buyer: userid, status: 'completed' })
                                    .populate('items', '_id name price')
                                    .populate('seller', 'fname lname')
                                    .lean();

    const soldOrders = await Order.find({ seller: userid, status: 'completed' })
                                    .populate('items', '_id name price')
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

    const userid = await getIdfromEmail(req.user.email);

    const pendingOrders = await Order.find({ seller: userid, status: 'pending' })
                                    .populate('items', '_id name price')
                                    .populate('buyer', 'fname lname')
                                    .lean();
      
    res.json(pendingOrders);

}

const addnewOrders = async (req, res) => {

    const orders = req.body.orders;
    const buyerid = await getIdfromEmail(req.user.email);

    let items = [];

    for (const order of orders) {

        order.buyer = buyerid;
        order.status = "pending";

        items.push.apply(items, order.items);

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        order.otp = await bcrypt.hash(otp, 10);

    }

    await Item.updateMany(
        { _id: { $in: items } },  // Find all documents with these IDs
        { $set: { ordered: true } }
    );

    const result = await Order.insertMany(orders);
    await User.findByIdAndUpdate(buyerid, { $set: { cart_items: [] } }, { new: true });
    res.json({orders: result});

};

const regenerateOTP = async (req, res) => {

    const orderid = req.params.orderId;

    const order = await Order.findById(orderid);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    order.otp = await bcrypt.hash(otp, 10);
    order.save();

    res.json({otp});

}

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
        
        res.status(200).json({success: true});

    } else res.json({success: false, message: 'Invalid OTP'});

}

module.exports = {
    getAllOrdersbyUser: errorWrapper(getAllOrdersbyUser),
    getPendingOrders: errorWrapper(getPendingOrders),
    addnewOrders: errorWrapper(addnewOrders),
    regenerateOTP: errorWrapper(regenerateOTP),
    markOrderAsCompleted: errorWrapper(markOrderAsCompleted)
};