const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login } = require('./handlers/users');
const FbAuth = require('./util/fbAuth');

//screams routes
app.get('/screams', getAllScreams)
app.post('/screams', FbAuth, postOneScream);

// user routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.region('europe-west1').https.onRequest(app);