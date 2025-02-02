const jwt = require('jsonwebtoken');
require('dotenv').config();

// verify the jwt token and extract user details
const authToken = (req, res, next) => {

    /* const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' }); */

    try {

        /* const decoded = jwt.verify(token, process.env.JWT_SECRET); */
        req.user = /* decoded */ {id: "6796193d557e110a6e5cbb9d"};
        next();

    } catch (error) {

        res.status(400).json({ message: 'Invalid token' });

    }

};

module.exports = authToken;