const NodeCache = require('node-cache')
const cache = new NodeCache()
const keys = require('../keys/cache_keys')

module.exports = {
	KEYS : keys
}

module.exports.saveInCache = function(key, obj) {
	cache.set(key, obj, (err, success) => {
		if(!err && success) {
			console.log(success)
		} else {
			console.log(err)
		}
	})
}

module.exports.deleteFromCache = function(key) {
	cache.del(key)
}

module.exports.getFromCache = function(key, callback) {
	cache.get(key, (err, value) => {
		if(err || value == undefined) {
			callback(null)
			return;
		}
		callback(value)
	})
}