const { db } = require('../util/admin');

exports.getAllGrunts = (req, res) => {
    db.collection('grunts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let grunts = []
            data.forEach((doc) => {
                grunts.push({
                    gruntId: doc.id,
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
exports.getGrunt = (req, res)=>{
    let gruntData = {};
    db.doc(`/grunts/${req.params.gruntId}`).get()
    .then((doc) => {
        if(!doc.exists){
            return res.status(404).json({error: "Grunt not found"})
        }
        gruntData = doc.data()
        gruntData.gruntId = doc.id
        return db.collection('comments').orderBy('createdAt', 'desc').where('gruntId', '==', req.params.gruntId).get()
        
    })
    .then((data) =>{
        gruntData.comments =[];
        data.forEach((doc) => {
            gruntData.comments.push(doc.data())
        })
        return res.json(gruntData)

    })
    .catch((err) =>{
        res.status(500.).json({error: err.code})
    });
};






