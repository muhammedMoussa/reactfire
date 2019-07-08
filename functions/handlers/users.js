const firebase = require('firebase');

const { admin, db } = require('../util/admin');
const { isEmail, isEmpty } = require('../util/validators');
const config = require('../util/config');
const { validateSignupData, validateLoginData } = require('../util/validators');

firebase.initializeApp(config);

exports.signup = (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle,
    };

    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

    const initImg = 'no-image.png';
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
            userId,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${initImg}?alt=media`,        }
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
    const userData = {
        email: request.body.email,
        password: request.body.password
    }

    const { valid, errors } = validateLoginData(userData);
    if (!valid) return res.status(400).json(errors);

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

exports.uploadImage = (request, response) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: request.headers });

    let imageToBeUploaded = {};
    let imageFileName;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log(fieldname, file, filename, encoding, mimetype);
      if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
        return response.status(400).json({ error: 'Wrong file type submitted' });
      }
      // my.image.png
      const imageExtension = filename.split('.')[filename.split('.').length - 1];
      // 123456.png
      imageFileName = `${Math.round(Math.random() * 10000000).toString()}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
      admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype
            }
          }
        })
        .then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          return db.doc(`/users/${request.user.handle}`).update({ imageUrl });
        })
        .then(() => { response.json({ message: 'image uploaded successfully' }) })
        .catch((err) => {
          console.error(err);
          return response.status(500).json({ error: 'something went wrong' });
        });
    });
    busboy.end(request.rawBody);
};