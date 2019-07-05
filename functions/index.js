const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const app = require('express')();

const config = require('./config');

admin.initializeApp();
firebase.initializeApp(config.firebaseConfig);
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
    debugger
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle,
    };

    let errors = {};

    if (isEmpty(newUser.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address';
    }

    if (isEmpty(newUser.password)) { errors.password = 'Must not be empty'; }
    if (newUser.password
            && newUser.confirmPassword
                && newUser.password !== newUser.confirmPassword) {
                    errors.confirmPassword = 'Passwords must match';
    }

    if (isEmpty(newUser.handle)) { errors.handle = 'Must not be empty'; }

    if (Object.keys(errors).length > 0) { return response.status(400).json(errors); }

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

// Validations Helpers..
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
};

exports.api = functions.region('europe-west1').https.onRequest(app);