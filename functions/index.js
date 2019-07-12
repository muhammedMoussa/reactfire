const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScream, getScream } = require('./handlers/screams');
const { signup,
        login,
        uploadImage,
        addUserDetails,
        getAuthenticatedUser } = require('./handlers/users');
const FbAuth = require('./util/fbAuth');

//screams routes
app.get('/screams', getAllScreams)
app.post('/screams', FbAuth, postOneScream);
app.get('/screams/:screamId', getScream);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FbAuth, uploadImage);
app.post('/user', FbAuth, addUserDetails);
app.get('/user', FbAuth, getAuthenticatedUser);

exports.api = functions.region('europe-west1').https.onRequest(app);