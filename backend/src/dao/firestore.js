const { db } = require('../configs/config');

const getUserCol = () => db.collection('users');

const getUser = (uid) => getUserCol().doc(uid);

const getChatsColForUser = (uid) => getUser(uid).collection('chats');

const getChatForUser = (uid, chatId) => getChatsColForUser(uid).doc(chatId);

const getChatMessagesForUser = (uid, chatId) => getChatForUser(uid, chatId).collection('messages');



getChatsColForUser

module.exports = {
  getUser,
  getUserCol,
  getChatsColForUser,
  getChatForUser,
  getChatMessagesForUser,
};