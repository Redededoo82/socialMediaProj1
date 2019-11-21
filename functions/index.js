
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const app = express();
const app2 = express();

const config = {
    apiKey: "AIzaSyDpre3LYFSaOES36poY1ikFNfGb1trJ8OI",
    authDomain: "socialmediaproj1-d378f.firebaseapp.com",
    databaseURL: "https://socialmediaproj1-d378f.firebaseio.com",
    projectId: "socialmediaproj1-d378f",
    storageBucket: "socialmediaproj1-d378f.appspot.com",
    messagingSenderId: "658622002806",
    appId: "1:658622002806:web:838514868dc0cdd5321157",
    measurementId: "G-SKRLZ99Y9E"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

//
/////Get requests///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//


app
    .get('/moans', (req, res) => {
        db
            .collection('moans')
            .orderBy('createdAt', 'desc')
            .get()
            .then(data => {
                let moans = [];
                data.forEach((doc) => {
                    moans.push({
                        moanID: doc.id,
                        body: doc.data()
                            .body,
                        userHandle: doc.data()
                            .userHandle,
                        createdAt: doc.data()
                            .createdAt
                    })
                })
                return res.json(moans)
            })
            .catch(err => console.error(err))
    })

app2
    .get('/grunts', (req, res) => {
        db
            .collection('grunts')
            .get()
            .then(data => {
                let grunts = []
                data
                    .forEach((doc) => {
                        grunts
                            .push({
                                gruntID:
                                    doc.id,
                                body:
                                    doc.data()
                                        .body,
                                userHandle:
                                    doc.data()
                                        .userHandle,
                                createdAt:
                                    doc.data()
                                        .createdAt

                            })
                    })
                return res.json(grunts)
            })
            .catch(err => console.error(err))
    })


//
/////Post requests///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//


app
    .post('/moan', (req, res) => {

        const newMoan = {
            body: req.body.body,
            userHandle: req.body.userHandle,
            createdAt: new Date().toISOString()
        };
        db
            .collection('moans')
            .add(newMoan)
            .then(doc => {
                res
                    .json({ message: `document ${doc.id} created successfully` })
            })
            .catch(err => {
                res
                    .status(500).json({ error: 'something went wrong' })
                console.log(err)
            })
    });

app2
    .post('/grunt', (req, res) => {

        const newGrunt = {
            body: req.body.body,
            userHandle: req.body.userHandle,
            createdAt: new Date().toISOString()

        };
        db
            .collection('grunts')
            .add(newGrunt)
            .then(doc => {
                res
                    .json({
                        message:
                            `document ${doc.id} created successfully`
                    });
            })
            .catch(err => {
                res
                    .status(500).json({
                        error:
                            'something went wrong'
                    });
                console.log(err)
            })
    });


//
/////signUp route/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle

    }

    // TODO: validate data
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle s already taken' })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.status(201).json({ token })
            // console.log(token)
        })
        .catch(err => {
            console.error(err)
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json( 'try again retard. The email is takin.' )
            } else {
                return res.status(500).json({ error: err.code })
            }
        })
})


exports.api = functions.https.onRequest(app)
exports.api2 = functions.https.onRequest(app2)
