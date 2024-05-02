const { GoogleGenerativeAI } = require("@google/generative-ai");
const { geminiKey } = require('../configs/config');

const genAI = new GoogleGenerativeAI(geminiKey);

const _ = require('lodash');

const chatDao = require('../dao/chats');
const userDao = require('../dao/users');

const createChat = (uid) => chatDao.createChat(uid);

const getChatMessages = async (uid, chatId) => {

  const messagesList = await chatDao.getChat({ uid, chatId });
  messagesList.sort((a, b) => a.timestamp - b.timestamp);

  if (messagesList.length == 1) {
    chatDao.updateChatName(uid, chatId, messagesList[0].content);
  }
  const messages = [];
  for (const msg of messagesList) {
    if (messages.length > 0 && messages[messages.length - 1].sender === msg.sender) {
      messages[messages.length - 1].content += '\n' + msg.content;
    } else {
      messages.push(msg);
    }
  }
  return messages;
}

const sendMessage = async (req, res) => {
  const { uid, chatId, message } = req.body;

  const savedMessage = await chatDao.chatAddMessage({ uid, chatId, message, sender: 'You', timestamp: Date.now() });

  if (!savedMessage) return res.json({ error: 1 });

  let fullMessage = "";

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  const messages = await getChatMessages(uid, chatId);

  let userText = "";

  while (messages.length > 0 && messages[messages.length - 1].sender !== 'AI') {
    userText = messages.pop().content + userText;
  }

  let prompt = '';
  const profile = await userDao.getUserProfile({ uid });
  const profilePrefix = `reply to user's message with appropriate style considering that:`;

  if (profile?.ageRanges?.length > 0) {
    if (prompt.length == 0) prompt = profilePrefix;
    prompt = `${prompt} user's age is ${profile.ageRanges[0]}.`;
  }

  if (profile?.childhoodSubjects?.length > 0) {
    if (prompt.length == 0) prompt = profilePrefix;
    prompt = `${prompt} user's childhood favorite subjects are ${profile.childhoodSubjects.join(', ')}.`;
  }

  if (profile?.expertise?.length > 0) {
    if (prompt.length == 0) prompt = profilePrefix;
    prompt = `${prompt} user's has expertise in ${profile.expertise.join(', ')}.`;
  }

  if (profile?.hobbies?.length > 0) {
    if (prompt.length == 0) prompt = profilePrefix;
    prompt = `${prompt} user's hobbies are ${profile.hobbies.join(', ')}.`;
  }

  if (profile?.knowledge?.length > 0) {
    if (prompt.length == 0) prompt = profilePrefix;
    prompt = `${prompt} user has knowledge about ${profile.knowledge.join(', ')}.`;
  }

  if (prompt.length > 0) {
    prompt = `${prompt}\n\nuser's message: ${userText}`;
  } else {
    prompt = userText;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  let result;
  if (messages.length > 0) {
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.sender == 'AI' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    result = await chat.sendMessageStream(prompt);
  } else {
    result = await model.generateContentStream(prompt);
  }


  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullMessage += chunkText;
    res.write(chunkText);
  }

  await chatDao.chatAddMessage({ uid, chatId, message: fullMessage, sender: 'AI', timestamp: Date.now() });

  res.end();
}

const getChat = async (uid, chatId) => {
  const chatInfo = await chatDao.getChatInfo({ uid, chatId });
  return {
    isFinished: chatInfo.isFinished,
    quiz: chatInfo.quiz,
    messages: await chatDao.getChat({ uid, chatId }),
  };
}

const getChatList = async (uid) => {
  return { chats: await chatDao.getChatList({ uid }) };
}


const generateQuiz = async (uid, chatId) => {
  const messages = await getChatMessages(uid, chatId);

  let prompt = 'Based on chat, generate quiz to evaluate user knowledge about newly gained information.'
    + ' generate quiz in valid JSON form. JSON should be a list of 5 questions, each question should have "question", "answers" and "answerExplanation" keys.'
    + ' "question" value should be a string. "answers" value should be a list of 3 possible answers. "answerExplanation" should be a string explaining correct answer.';

  prompt += "\n\n chat:[\n";

  messages.forEach(({ sender, content }) => {
    prompt += `${sender == 'AI' ? 'model' : 'user'}: <<${content}>>\n`;
  })

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const json = JSON.parse(text.substring(text.indexOf('['), text.lastIndexOf(']') + 1));
  return [json, text];
}

const finishChat = async (uid, chatId) => {
  const chatInfo = await chatDao.getChatInfo({ uid, chatId });
  if (!chatInfo) return { error: 'no chat' };
  if (chatInfo.isFinished) return chatInfo?.quiz || {};

  const [quiz, quizText] = await generateQuiz(uid, chatId);

  await chatDao.updateChat(uid, chatId, 'isFinished', true);
  await chatDao.updateChat(uid, chatId, 'quiz', quiz);
  await chatDao.updateChat(uid, chatId, 'quizText', quizText);

  return quiz;
}

const getChatQuiz = async (uid, chatId) => {
  const chatInfo = await chatDao.getChatInfo({ uid, chatId });
  if (chatInfo.quiz) return chatInfo.quiz
  return {};
}

const updateUserBasedOnQuiz = async (uid, chatId) => {
  const { quiz } = await chatDao.getChatInfo({ uid, chatId });

  let prompt = `create JSON about person, JSON should be shortest list of keywords indicating persons knowledge based on quiz answers below. list should be made of strings`

  quiz.forEach(q => {
    prompt += `\n\n on question: <${q.question}>, with multiple choice answers [${q.answers.map(a => `<${a}>`).join(", ")}], person chose <${q.userAnswer}>.`;
  })

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  let json = JSON.parse(text.substring(text.indexOf('['), text.lastIndexOf(']') + 1));
  json = json.map(e => _.kebabCase(e));
  return json;
}

const sendQuizAnswers = async (uid, chatId, answers) => {
  const { quiz } = await chatDao.getChatInfo({ uid, chatId });
  if (quiz) {
    if (quiz.length == answers.length) {
      for (let i = 0; i < quiz.length; i++) {
        quiz[i].userAnswer = answers[i];
      }
      await chatDao.updateChat(uid, chatId, 'quiz', quiz)
      const knowledge = await updateUserBasedOnQuiz(uid, chatId);
      const profile = await userDao.getUserProfile({ uid }) || {};
      profile.knowledge = _.uniq([...(profile?.knowledge || []), ...knowledge]);
      await userDao.setUserProfile(({ uid, profile }));
    }
  }
  return {};
}


module.exports = {
  createChat,
  getChat,
  getChatList,
  sendMessage,
  finishChat,
  getChatQuiz,
  sendQuizAnswers,
}
