
const functions = require('firebase-functions');

const express = require('express');
const app = express();

require('dotenv').config();

const FBAuth = require('./util/fbAuth');

const { getAllGrunts, postOneGrunt } = require('./handlers/grunts');
const { signup, login, uploadImage } = require('./handlers/users');



///grunt routes///

app.get('/grunts', getAllGrunts);
app.post('/grunt', FBAuth, postOneGrunt);


///user routes///

app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)

exports.api = functions.https.onRequest(app);