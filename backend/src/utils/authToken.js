const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// verify the jwt token and extract user details
const authToken = (req, res, next) => {

    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {

        res.status(400).json({ message: 'Invalid token' });

    }

};

module.exports = {
    
    generateToken,
    authToken
    
};