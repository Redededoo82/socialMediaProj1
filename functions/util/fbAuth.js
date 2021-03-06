const {admin, db} = require('./admin')
///authentication middleware///

module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('no token found')
        return res.status(403).json({ error: 'Unauthorized' });
    }
    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            console.log(decodedToken)
            return db.collection('users')
                .where('userIdKey', '==', req.user.uid)
                .limit(1)
                .get()
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle;
            return next()
        })
        .catch(err => {
            console.error(('error while verifying token', err));
            return res.status(403).json(err);
        })
}