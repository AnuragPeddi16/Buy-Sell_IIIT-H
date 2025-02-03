const User = require('../models/User');
const errorWrapper = require('../utils/errorWrapper');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../utils/authToken');

const getIdfromEmail = async (email) => {

    const user = await User.findOne({ email: email }).lean();
    return user._id;

}

// get user details by user ID - only the user in question can access
const getPrivateUserDetails = async (req, res) => {

    /* const userid = req.params.userId;
    if (userid != req.user.id) return res.status(403).json({message: 'Access denied.'}); // check if user is authorized */

    const useremail = req.user.email;
    const userid = await getIdfromEmail(useremail);

    const user = await User.findById(userid).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    delete user.cart_items;

    res.json(user);

};

// get public user details by user ID - anyone can access
const getPublicUserDetails = async (req, res) => {

    const userid = req.params.userId;

    const user = await User.findById(userid).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({user: {
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                contact: user.contact,
                reviews: user.reviews
            }});

};

const loginUser = async (req, res) => {

    const login = req.body;
    const email = login.email;

    const user = await User.findOne({ email: email }).lean();
    if (!user) return res.status(400).json({message: "User not found"});

    const isMatch = await bcrypt.compare(login.password, user.password);
    if (!isMatch) return res.status(400).json({message: "Email or password incorrect"});

    const token = generateToken(user);

    res.cookie("authToken", token, {
            httpOnly: true, secure: false, sameSite: "Lax", maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .send({ message: "Login successful", user });

}

const addnewUser = async (req, res) => {

    const user = req.body;
    user.password = await bcrypt.hash(user.password, 10);

    try {

        const newUser = new User(user);
        const savedUser = await newUser.save();

        const token = generateToken(user);

        res.cookie("authToken", token, {
                httpOnly: true, secure: false, sameSite: "Lax", maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .send({ message: "Login successful", user });

    } catch (error) {

        // mongodb error for failing uniqueness
        if (error.code === 11000) {

            res.status(400).json({ message: 'Email already in use' });

        } else {

            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });

        }
    }

};

const logoutUser = async (req, res) => {

    res.clearCookie("authToken").send({ message: "Logged out successfully" });

}

// Update user details
const updateUserDetails = async (req, res) => {

    const useremail = req.user.email;
    const userid = await getIdfromEmail(useremail);

    const user = await User.findByIdAndUpdate(userid, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);

};

const updatePassword = async (req, res) => {

    const useremail = req.user.email;
    const userid = await getIdfromEmail(useremail);
    const passwords = req.body;

    const user = await User.findById(userid);

    const isMatch = await bcrypt.compare(passwords.oldPassword, user.password);
    if (!isMatch) return res.status(400).json({message: "Old Password incorrect"});

    const newPassword = passwords.newPassword;
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({message: "Success"});

}

const getCartItems = async (req, res) => {

    const useremail = req.user.email;
    const userid = await getIdfromEmail(useremail);

    const user = await User.findById(userid).populate('cart_items', 'name price').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cart_items = user.cart_items;

    res.json(cart_items);

};

const deleteFromCart = async (req, res) => {

    const useremail = req.user.email;
    const userid = await getIdfromEmail(useremail);
    const itemid = req.params.itemId;

    let user;
    if (itemid == 'all') {
        user = await User.findByIdAndUpdate(userid, { $set: { cart_items: [] } }, { new: true });
    } else {
        user = await User.findByIdAndUpdate(userid, { $pull: { cart_items: itemid } }, { new: true });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.cart_items);

};
  
module.exports = {
    getPrivateUserDetails: errorWrapper(getPrivateUserDetails),
    getPublicUserDetails: errorWrapper(getPublicUserDetails),
    loginUser: errorWrapper(loginUser),
    addnewUser: addnewUser,
    logoutUser: errorWrapper(logoutUser),
    updateUserDetails: errorWrapper(updateUserDetails),
    updatePassword: errorWrapper(updatePassword),
    getCartItems: errorWrapper(getCartItems),
    deleteFromCart: errorWrapper(deleteFromCart)
};