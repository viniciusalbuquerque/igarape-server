
const TABLE = require('../keys/table_info')
const admin = require('firebase-admin');
const igarapeAccount = require('../keys/igarape-a457d-firebase-adminsdk-3cd82-6b1a6c4e81.json')
admin.initializeApp( {
  credential: admin.credential.cert(igarapeAccount)
})

const db = admin.firestore()


function localCallback(querySnapshot, err, externalCallback) {
  if(err) {
    externalCallback(null, err)
    return;
  }

  var array = [];
  querySnapshot.forEach(doc => {
    array.push(doc.data())
  })
  externalCallback(array, null)
}

function executeQuery(query, callback) {
  query.get()
  .then(querySnapshot => {
    localCallback(querySnapshot, null, callback)
  })
  .catch(err => {
    console.error('Error getting document', err)
    localCallback(null, err, callback)
  })
}

module.exports.getPosts = function(callback) {
  //Improve way of loading posts from a specific author. (Some kind of ID)
  var query = db.collection(TABLE.POST_TABLE);
  executeQuery(query, callback)
}

module.exports.getEvents = function(event, callback) {
  //Reference by id
  var query = db.collection(TABLE.EVENT_TABLE);
  executeQuery(query, callback)
}