const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from ReacFire!");
});

exports.getScreams = functions.https.onRequest((request, response) => {
    admin
    .firestore()
    .collection('screams')
    .then(data => {
        let screams = [];
        data.forEach( doc => screams.push(doc.data()));
        return response.json(screams);
    })
    .catch(error => console.error(error));
});
