const crypto = require('crypto')
const got = require('got')
const oauth = require('oauth-1.0a')

console.log('process.env.TM_CONSUMER_KEY', process.env.TM_CONSUMER_KEY)
console.log('process.env.TM_CONSUMER_SECRET', process.env.TM_CONSUMER_SECRET)

const authorization = oauth({
	consumer: {
		key: process.env.TM_CONSUMER_KEY,
		secret: process.env.TM_CONSUMER_SECRET
	},
	signature_method: 'HMAC-SHA1', // eslint-disable-line camelcase
	hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64') // eslint-disable-line camelcase
})

const url = 'https://api.tmsandbox.co.nz/v1/Search/Property/Rental.json'

module.exports = () => got(url, {
	headers: authorization.toHeader(authorization.authorize({url, method: 'GET'}))
})
.then(res => {
	console.log('body', res.body)
})
.catch(err => {
	console.log('err', err)
})
