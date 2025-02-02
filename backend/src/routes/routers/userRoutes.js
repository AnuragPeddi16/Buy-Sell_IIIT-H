const express = require('express');
const authToken = require('../../utils/authToken');

const {
    getPrivateUserDetails,
    getPublicUserDetails,
    checkPassword,
    addnewUser,
    updateUserDetails,
    updatePassword,
    getCartItems,
    deleteFromCart
} = require('../../controllers/userController');

const router = express.Router();

router.get('/details', authToken, getPrivateUserDetails); // GET /api/users/details
router.put('/details', authToken, updateUserDetails); // PUT /api/users/details
router.post('/details', addnewUser) // POST /api/users/details (no auth for new user)
router.post('/login', checkPassword) // POST /api/users/login (no suth for login)
router.put('/password', authToken, updatePassword) // PUT /api/users/password
router.get('/cart/all', authToken, getCartItems); // GET /api/users/cart/all
router.delete('/cart/delete/:itemId', authToken, deleteFromCart); // DELETE /api/users/cart/delete/:itemId (itemId == 'all' to clear cart)
router.get('/:userId', authToken, getPublicUserDetails); // GET /api/users/:userId

module.exports = router;