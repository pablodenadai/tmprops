if (!process.env.TM_CONSUMER_KEY || !process.env.TM_CONSUMER_SECRET) {
	throw new Error('Please set Consumer Key and Consumer Secret environment variables')
}
console.log('process.env.TM_CONSUMER_KEY', process.env.TM_CONSUMER_KEY)
console.log('process.env.TM_CONSUMER_SECRET', process.env.TM_CONSUMER_SECRET)

const co = require('co')
const got = require('got')

// -- Mongo
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/tmprops')

const Schema = mongoose.Schema
const propSchema = new Schema({
	_id: String
}, {strict: false})

const Property = mongoose.model('property', propSchema)
// -- Mongo

const url = 'https://api.tmsandbox.co.nz/v1/Search/Property/Rental.json'

const fetchPage = (url, page) => {
	console.log(`fetching page ${page}`)

	return got(url, {
		headers: {Authorization: `OAuth oauth_consumer_key=${process.env.TM_CONSUMER_KEY}, oauth_signature_method=PLAINTEXT, oauth_signature=${process.env.TM_CONSUMER_SECRET}&`},
		query: {Page: page},
		json: true
	})
}

const insertMany = list => {
	console.log(`inserting ${list.length} items`)

	list = list.map(item => Object.assign({}, item, {_id: item.ListingId}))
	return Property.insertMany(list)
}

const fetchAndCache = co.wrap(function * (url) {
	let page = 1
	let data

	try {
		do {
			data = yield fetchPage(url, page)
			yield insertMany(data.body.List)
			page++
		} while (data.body.List.length)
	} catch (err) {
		throw new Error(err)
	} finally {
		yield mongoose.disconnect()
	}
})

module.exports = () => fetchAndCache(url)
