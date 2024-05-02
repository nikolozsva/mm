const express = require('express');
const route = express.Router();

const coreController = require('../controllers/core')
const { checkUserToken } = require('../middleware/middleware');

route.get('/profile', checkUserToken, coreController.profile);
route.get('/create-chat', checkUserToken, coreController.createChat);
route.get('/get-chat-list', checkUserToken, coreController.getChatList);
route.get('/get-chat/:chatId', checkUserToken, coreController.getChat);
route.post('/send-message', checkUserToken, coreController.sendMessage);
route.post('/save-profile', checkUserToken, coreController.saveProfile);
route.get('/finish-chat/:chatId', checkUserToken, coreController.finishChat);
route.get('/get-chat-quiz/:chatId', checkUserToken, coreController.getChatQuiz);
route.post('/send-quiz-answers/:chatId', checkUserToken, coreController.sendQuizAnswers);

module.exports = route;
