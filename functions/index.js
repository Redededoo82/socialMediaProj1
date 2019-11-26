
const functions = require('firebase-functions');

const express = require('express');
const app = express();

require('dotenv').config();

const FBAuth = require('./util/fbAuth');

const { getAllGrunts, postOneGrunt , getGrunt} = require('./handlers/grunts');
const { signup, login, uploadImage, addUserDetails,getAuthenticatedUser } = require('./handlers/users');



///grunt routes///

app.get('/grunts', getAllGrunts);
app.post('/grunt', FBAuth, postOneGrunt);
app.get('/grunt/:gruntId', getGrunt)


//TODO deleteGrunt
//TODO likeGrunt
//TODO unlikeGrunt
//TODO commentOnGrunt


///user routes///

app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app);