const express = require('express');
const authToken = require('../../utils/authToken');

const {
    getItemDetails,
    getAllItems,
    addnewItem,
    deleteItem
} = require('../../controllers/itemController');

const router = express.Router();

router.get('/all', authToken, getAllItems); // GET /api/items/all
router.get('/:itemId', authToken, getItemDetails); // GET /api/items/:itemId
router.post('/add', authToken, addnewItem); // POST /api/items/add
router.delete('/:itemId', authToken, deleteItem); // DELETE /api/items/:itemId

module.exports = router;