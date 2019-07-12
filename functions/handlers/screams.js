const { db } = require('../util/admin');

exports.getAllScreams = (request, response) => {
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
}

exports.postOneScream = (request, response) => {
    console.log(request.user)
    const schema = {
        body: request.body.body,
        userHandle: request.user.handle,
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
}

exports.getScream = (request, response) => {
    let screamData = {};
    db.doc(`/screams/${request.params.screamId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Scream not found' });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db.collection('comments').orderBy('createdAt', 'desc')
                    .where('screamId', '==', request.params.screamId).get();
        })
        .then(data => {
            console.log(data);
            screamData.comments = [];
            data.comments.forEach(doc => screamData.comments.push(doc.data()));
            return response.json(screamData);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).json({ error: error.code });
        });
}

exports.commentOnScream = (request, response) => {
    if (request.body.body.trim() === '')
      return response.status(400).json({ comment: 'Must not be empty' });

    const newComment = {
      body: request.body.body,
      createdAt: new Date().toISOString(),
      screamId: request.params.screamId,
      userHandle: request.user.handle,
      userImage: request.user.imageUrl ? request.user.imageUrl : ' '
    };

    db.doc(`/screams/${request.params.screamId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return response.status(404).json({ error: 'Scream not found' });
        }
        return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
      })
      .then(() => {
        return db.collection('comments').add(newComment);
      })
      .then(() => {
        response.json(newComment);
      })
      .catch((err) => {
        console.log(err);
        response.status(500).json({ error: 'Something went wrong' });
      });
};