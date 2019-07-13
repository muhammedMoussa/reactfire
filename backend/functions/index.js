const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams,
        postOneScream,
        getScream,
        commentOnScream,
        likeScream,
        unlikeScream,
        deleteScream } = require('./handlers/screams');
const { signup,
        login,
        uploadImage,
        addUserDetails,
        getAuthenticatedUser } = require('./handlers/users');
const FbAuth = require('./util/fbAuth');

//screams routes
// @TODO: FIX scream AND screams ROUTES..
app.get('/screams', getAllScreams)
app.post('/screams', FbAuth, postOneScream);
app.get('/screams/:screamId', getScream);
app.delete('/scream/:screamId', FbAuth, deleteScream);
app.post('/scream/:screamId/comment', FbAuth, commentOnScream);
app.get('/scream/:screamId/like', FbAuth, likeScream);
app.get('/scream/:screamId/unlike', FbAuth, unlikeScream);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FbAuth, uploadImage);
app.post('/user', FbAuth, addUserDetails);
app.get('/user', FbAuth, getAuthenticatedUser);

exports.api = functions.region('europe-west1').https.onRequest(app);