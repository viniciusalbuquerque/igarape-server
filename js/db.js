
const TABLE = require('../keys/table_info')
const admin = require('firebase-admin');
const igarapeAccount = require('../keys/igarape-a457d-firebase-adminsdk-3cd82-6b1a6c4e81.json')
admin.initializeApp( {
  credential: admin.credential.cert(igarapeAccount)
})

const db = admin.firestore()


function localCallback(querySnapshot, res, externalCallback){
  var array = [];
  querySnapshot.forEach(doc => {
    array.push(doc.data())
  })
  externalCallback(res, array, null)
}

function executeQuery(query, res, callback) {
  query.get()
  .then(querySnapshot => {
    localCallback(querySnapshot, res, callback)
  })
  .catch(err => {
    console.error('Error getting document', err)
    callback(res, null, err)
  })
}

module.exports.getPosts = function(author, res, callback) {
  //Improve way of loading posts from a specific author. (Some kind of ID)
  var query = db.collection(TABLE.POST_TABLE);
  if(author)
    query = query.where(TABLE.POST_AUTHOR, '==', author)
  
  executeQuery(query, res, callback)
}

module.exports.getEvents = function(event, res, callback) {
  //Reference by id
  var query = db.collection(TABLE.EVENT_TABLE);
  if(event)
    query = query.where(TABLE.EVENT_NAME, '==', event)

  executeQuery(query, res, callback)
}