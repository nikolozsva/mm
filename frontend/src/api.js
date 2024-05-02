import { getAuth, getIdToken } from 'firebase/auth';

// const baseUrl = 'http://localhost:3000';
const baseUrl = 'https://mm-gemini-v1-kz2epgldxq-as.a.run.app';

const getAuthHeader = async (user) => {

  const idToken = await getIdToken(user, true);

  return new Headers({
    'Authorization': `Bearer ${idToken}`,
    "Content-Type": "application/json"
  });
}

export async function createChat(user) {

  const response = await fetch(`${baseUrl}/create-chat`, {
    method: 'GET',
    headers: await getAuthHeader(user),
  });

  const data = await response.json();
  return data;
}

export async function sendMessage(user, chatId, message, addMessageChunk, callback) {
  const response = await fetch(`${baseUrl}/send-message`, {
    method: 'POST',
    headers: await getAuthHeader(user),
    body: JSON.stringify({
      chatId,
      message,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let msg = "";

  const read = async () => {
    const { done, value } = await reader.read();
    if (done) {
      callback();
      return;
    }
    const newText = decoder.decode(value);
    msg += newText;
    addMessageChunk(msg);
    read();
  };

  read();
}

export async function getChat(user, chatId) {

  const response = await fetch(`${baseUrl}/get-chat/${chatId}`, {
    method: 'GET',
    headers: await getAuthHeader(user),
  });

  const data = await response.json();
  return data;
}

export async function getChatList(user) {

  const response = await fetch(`${baseUrl}/get-chat-list`, {
    method: 'GET',
    headers: await getAuthHeader(user),
  });

  const data = await response.json();
  return data;
}

export async function getProfile(user) {

  const response = await fetch(`${baseUrl}/profile`, {
    method: 'GET',
    headers: await getAuthHeader(user),
  });

  const data = await response.json();
  return data;
}

export async function setUserProfile(user, profile) {

  const response = await fetch(`${baseUrl}/save-profile`, {
    method: 'POST',
    headers: await getAuthHeader(user),
    body: JSON.stringify({
      profile,
    }),
  });

  const data = await response.json();
  return data;
}

export async function finishChat(user, chatId) {
  const response = await fetch(`${baseUrl}/finish-chat/${chatId}`, {
    method: 'GET',
    headers: await getAuthHeader(user),
  });

  const data = await response.json();
  return data;
}

export async function sendQuizAnswers(user, chatId, answers) {

  const response = await fetch(`${baseUrl}/send-quiz-answers/${chatId}`, {
    method: 'POST',
    headers: await getAuthHeader(user),
    body: JSON.stringify({
      answers,
    }),
  });

  const data = await response.json();
  return data;
}
