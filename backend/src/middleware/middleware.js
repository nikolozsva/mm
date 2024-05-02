const { auth } = require('../configs/config');

const checkUserToken = (req, res, next) => {

    const authorization = req.header('authorization') || req.header('Authorization');
    if (authorization) {
        const idToken = authorization.split('Bearer ')[1];
        if (!idToken) {
            res.status(400).send('TOKEN IS NOT VALID');
            return;
        }

        return auth.verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const { uid } = decodedToken;
                req.body.uid = uid;
                next();
            });
    }

    res.status(400).send('THERE IS NO TOKEN');
};


module.exports = { checkUserToken };