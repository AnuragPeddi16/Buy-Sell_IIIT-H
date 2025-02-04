const express = require('express');
const {authToken} = require('../../utils/authToken');

const sendChatMessage = require('../../controllers/chatbotController');

const router = express.Router();

router.post('/send', authToken, sendChatMessage); // POST /api/chat/send

module.exports = router;