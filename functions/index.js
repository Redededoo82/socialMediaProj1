const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const app = express();


app.get('/moans', (req, res)=>{
    admin.firestore().collection('moans').get()
    .then(data=>{
        let moans = [];
        data.forEach(doc=>{
            moans.push(doc.data())
        });
        return res.json(moans);
    })
    .catch(err=> console.error(err));
})


app.post('/moan',(req, res)=>{
    
    const newMoan ={
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    admin.firestore()
        .collection('moans')
        .add(newMoan)
        .then(doc=>{
            res.json({message: `document ${doc.id} created successfully`});
        })
        .catch(err=>{
            res.status(500).json({error: 'something went wrong'});
            console.log(err)
        })
});
exports.api = functions.https.onRequest(app);
