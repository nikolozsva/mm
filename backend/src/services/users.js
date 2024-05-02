const userDao = require('../dao/users');

const profile = async (uid) => {
  const p = await userDao.getUserProfile({ uid })
  return { learningStyle: p?.learningStyles };
}

const saveUserProfile = async (uid, profile) => {
  const p = await userDao.getUserProfile({ uid });
  if (!p) {
    await userDao.setUserProfile({ uid, profile });
    return { updated: true };
  }
  return { updated: false };
}

module.exports = {
  profile,
  saveUserProfile,
}
