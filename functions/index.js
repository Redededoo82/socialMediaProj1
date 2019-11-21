const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const app = express();
const app2 = express();


        //
/////Get requests//////////////////////////////////////////
        //


app.get('/moans', (req, res)=>{
    admin.firestore().collection('moans').get()
    .then(data=>{
        let moans = [];
        data.forEach((doc)=>{
            moans.push({
                moanID: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt

            });
        });
        return res.json(moans);
    })
    .catch(err=> console.error(err));
})
app2.get('/grunts', (req, res)=>{
    admin.firestore().collection('grunts').get()
    .then(data=>{
        let grunts = [];
        data.forEach((doc)=>{
            grunts.push({
                gruntID: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt

            });
        });
        return res.json(grunts);
    })
    .catch(err=> console.error(err));
})


        //
/////Post requests//////////////////////////////////////////////////////
        //


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
app2.post('/grunt',(req, res)=>{
    
    const newGrunt ={
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    admin.firestore()
    .collection('grunts')
    .add(newGrunt)
    .then(doc=>{
        res.json({message: `document ${doc.id} created successfully`});
    })
    .catch(err=>{
        res.status(500).json({error: 'something went wrong'});
        console.log(err)
    })
});

exports.api = functions.https.onRequest(app);
exports.api2 = functions.https.onRequest(app2);
