
const _ = require('lodash');
const {
  getChatForUser,
  getChatsColForUser,
  getChatMessagesForUser,
} = require('./firestore');

const createChat = async (uid) => {
  const doc = await getChatsColForUser(uid).add({
    created: Date.now(),
  });

  return doc.id;
}

const updateChat = async (uid, chatId, key, value) => getChatsColForUser(uid).doc(chatId).update({ [key]: value });

const updateChatName = async (uid, chatId, name) => updateChat(uid, chatId, 'name', name);


const chatAddMessage = async ({ uid, chatId, message, sender, timestamp }) => {
  const chatDoc = await getChatsColForUser(uid).doc(chatId).get();
  if (chatDoc.exists) {
    await getChatMessagesForUser(uid, chatId).add({
      timestamp,
      sender,
      content: message
    })
    return true;
  }
  return false;
}

const getChat = async ({ uid, chatId }) => {
  const msgsCol = await getChatMessagesForUser(uid, chatId).get();
  const messages = [];
  msgsCol.forEach(doc => {
    messages.push({
      id: doc.id,
      ...doc.data(),
    })
  });

  return _.sortBy(messages, ['timestamp']);
}


const getChatInfo = async ({ uid, chatId }) => {
  const doc = await getChatForUser(uid, chatId).get();
  if (doc.exists) {
    return doc.data();
  }
}


const getChatList = async ({ uid }) => {
  const chatsCol = await getChatsColForUser(uid).get();
  const chats = [];
  chatsCol.forEach(doc => {
    chats.push({
      id: doc.id,
      ...doc.data(),
    })
  });

  return _.sortBy(chats, ['created']);
}

module.exports = {
  createChat,
  chatAddMessage,
  getChat,
  getChatList,
  updateChat,
  updateChatName,
  getChatInfo,
}