const chatsService = require('../services/chats.js');
const usersService = require('../services/users.js');


exports.profile = async (req, res) => {
    res.json({ profile: await usersService.profile(req.body.uid) });
}

exports.createChat = async (req, res) => {
    res.json({ chatId: await chatsService.createChat(req.body.uid) });
}

exports.getChat = async (req, res) => {
    res.json(await chatsService.getChat(req.body.uid, req.params.chatId));
}

exports.getChatList = async (req, res) => {
    res.json(await chatsService.getChatList(req.body.uid));
}

exports.sendMessage = async (req, res) =>
    chatsService.sendMessage(req, res);

exports.saveProfile = async (req, res) => {
    res.json(await usersService.saveUserProfile(req.body.uid, req.body.profile));
}

exports.finishChat = async (req, res) => {
    res.json(await chatsService.finishChat(req.body.uid, req.params.chatId));
}

exports.getChatQuiz = async (req, res) => {
    res.json(await chatsService.getChatQuiz(req.body.uid, req.params.chatId));
}


exports.sendQuizAnswers = async (req, res) => {
    res.json(await chatsService.sendQuizAnswers(req.body.uid, req.params.chatId, req.body.answers));
}

