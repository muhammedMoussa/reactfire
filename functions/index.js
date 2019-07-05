const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const app = require('express')();

const firebaseConfig = {
    apiKey: "AIzaSyBbDjjAE1vbUwtGnuVBGwMU9dtRAP8enTY",
    authDomain: "reactfire-fb6d1.firebaseapp.com",
    databaseURL: "https://reactfire-fb6d1.firebaseio.com",
    projectId: "reactfire-fb6d1",
    storageBucket: "reactfire-fb6d1.appspot.com",
    messagingSenderId: "362775888219",
    appId: "1:362775888219:web:3a6e10fbfe5644e7"
  };

admin.initializeApp();
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

app.get('/screams', (request, response) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach( doc => screams.push({
            screamId: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt
        }));
        return response.json(screams);
    })
    .catch(error => console.error(error));
})

app.post('/screams', (request, response) => {
    const schema = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
    .collection('screams')
    .add(schema)
    .then(doc => response.json({ message: `Created ${doc.id}` }))
    .catch(error => {
        response.status(500).json({ error: 'Something went wrong :(' })
        console.error(error)
    });
});

// Signup Route
app.post('/signup', (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle,
    };

    let token, userId;

    db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response.status(400).json({ handle: 'this handle is already taken' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        }
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => response.status(201).json({ token }))
    .catch(error => {
        console.error(error);
        if (error.code === 'auth/email-already-in-use') {
            return response.status(400).json({ email: 'Email is already is use' });
        } else {
            return response
            .status(500)
            .json({ general: 'Something went wrong, please try again' });
        }
    })
    // @TODO: Validate Data
});

exports.api = functions.region('europe-west1').https.onRequest(app);