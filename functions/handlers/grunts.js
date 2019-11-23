const { db } = require('../util/admin');

exports.getAllGrunts = (req, res) => {
    db.collection('grunts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let grunts = []
            data.forEach((doc) => {
                grunts.push({
                    gruntID: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt

                })
            })
            return res.json(grunts)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}



exports.postOneGrunt = (req, res) => {

    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
    }

    const newGrunt = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()

    };
    db.collection('grunts')
        .add(newGrunt)
        .then(doc => {
            res.json({
                message: `document ${doc.id} created successfully`
            });
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err)
        })
}






