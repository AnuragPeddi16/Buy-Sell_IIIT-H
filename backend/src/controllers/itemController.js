const Item = require("../models/Item");
const User = require("../models/User");
const errorWrapper = require('../utils/errorWrapper');

const getIdfromEmail = async (email) => {

    const user = await User.findOne({ email: email }).lean();
    return user._id;

}

// get details of one item
const getItemDetails = async (req, res) => {

    const itemid = req.params.itemId;

    const item = await Item.findById(itemid).populate('seller', 'fname lname').lean();
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);

}

// get details of all items (without description)
const getAllItems = async (req, res) => {

    const userid = await getIdfromEmail(req.user.email);

    const items = await Item.find({ seller: {$ne: userid} }).populate('seller', 'fname lname').lean();
    items.forEach(item => delete item["description"]);
    res.json(items);

}

const addnewItem = async (req, res) => {

    const item = req.body;
    item.seller = await getIdfromEmail(req.user.email);

    /* const seller = await User.findById(item.seller).select("fname lname").lean();
    item.sellername = seller.lname ? seller.fname + " " + seller.lname : seller.fname; */

    const newItem = new Item(item);
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);

};

const deleteItem = async (req, res) => {

    const itemid = req.params.itemId;

    const deletedItem = await Item.findByIdAndDelete(itemid).lean();
    if (!deletedItem) return res.status(404).json({ message: 'Item not found.' });

    res.status(200).json(deletedItem);

}

module.exports = {
    getItemDetails: errorWrapper(getItemDetails),
    getAllItems: errorWrapper(getAllItems),
    addnewItem: errorWrapper(addnewItem),
    deleteItem: errorWrapper(deleteItem)
};