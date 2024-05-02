const {
  getUser,
} = require('./firestore');

const getUserProfile = async ({ uid }) => {
  const user = await getUser(uid).get();
  if (user.exists) {
    return user.data().profile;
  }
}

const setUserProfile = async ({ uid, profile }) => {
  const user = await getUser(uid).get();
  if (user.exists) {
    await getUser(uid).update({ profile });
  } else {
    await getUser(uid).set({ profile });
  }
}

module.exports = {
  getUserProfile,
  setUserProfile,
}