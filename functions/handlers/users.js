const firebase = require('firebase');

const { db } = require('../util/admin');
const { isEmail, isEmpty } = require('../util/validators');
const config = require('../util/config');

firebase.initializeApp(config);

exports.signup = (request, response) => {
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
    });
}

exports.login = (request, response) => {
    let errors = {};
    const userData = {
        email: request.body.email,
        password: request.body.password
    }

    if (isEmpty(userData.password)) { errors.password = 'Must not be empty'; }
    if (isEmpty(userData.email)) { errors.email = 'Must not be empty'; }

    if (Object.keys(errors).length > 0) { return response.status(400).json(errors); }

    firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
    .then(data => data.user.getIdToken())
    .then( token => response.json({ token }))
    .catch(error => {
        console.error(error);
        if (error.code === 'auth/wrong-password') {
            return response.status(401).json({ general: 'Wrong credentials, you can try again!' });
        } else {
            return response
            .status(500)
            .json({ general: 'Something went wrong, please try again' });
        }
    })

}