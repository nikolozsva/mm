const admin = require('firebase-admin');
const credentials = require('./firebase_key.json');
const { key: geminiKey } = require('./gemini_key.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const auth = admin.auth();
const db = admin.firestore();
module.exports = { auth, db, geminiKey };
