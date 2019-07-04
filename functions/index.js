const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp();

app.get('/screams', (request, response) => {
    admin
    .firestore()
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

    admin
    .firestore()
    .collection('screams')
    .add(schema)
    .then(doc => response.json({ message: `Created ${doc.id}` }))
    .catch(error => {
        response.status(500).json({ error: 'Something went wrong :(' })
        console.error(error)
    });
});

exports.api = functions.region('europe-west1').https.onRequest(app);