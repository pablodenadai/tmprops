const co = require('co')
const got = require('got')

if (!process.env.TM_CONSUMER_KEY || !process.env.TM_CONSUMER_SECRET) {
	throw new Error('Please set Consumer Key and Consumer Secret environment variables')
}

console.log('process.env.TM_CONSUMER_KEY', process.env.TM_CONSUMER_KEY)
console.log('process.env.TM_CONSUMER_SECRET', process.env.TM_CONSUMER_SECRET)

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
	return Promise.resolve(true)
}

const fetchAndCache = co.wrap(function * (url) {
	let page = 1
	let data

	do {
		data = yield fetchPage(url, page)
		yield insertMany(data.body.List)
		page++
		if (page > 3) {
			break
		}
	} while (data.body.List.length)
})

module.exports = () => fetchAndCache(url)
