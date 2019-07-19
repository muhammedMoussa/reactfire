const functions = require('firebase-functions');
const app = require('express')();

const { db } = require('./util/admin');
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
        getAuthenticatedUser,
        getUserDetails,
        markNotificationsRead } = require('./handlers/users');
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
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FbAuth, markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((error) => console.error(error));
  });

exports.deleteNotificationOnUnLike = functions
    .region('europe-west1')
    .firestore.document('likes/{id}')
    .onDelete((snapshot) => {
    return db
        .doc(`/notifications/${snapshot.id}`)
        .delete()
        .catch((error) => {
            console.error(error);
            return;
        });
});

exports.createNotificationOnComment = functions
    .region('europe-west1')
    .firestore.document('comments/{id}')
    .onCreate((snapshot) => {
    return db
        .doc(`/screams/${snapshot.data().screamId}`)
        .get()
        .then((doc) => {
        if (doc.exists) {
            return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
            });
        }
    })
    .catch((error) => console.error(error));
});
