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

exports.createScreams = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        return response.status(400).json({ error: 'Method Not Allowed!' });
    }

    const schema = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
