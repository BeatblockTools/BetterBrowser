const https = require('https')
const fs = require('fs').promises
const md5 = require('md5')

const baseUrl = "https://beatblockbrowser.me/api/search/"
const terms = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ")

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (resp) => {
			let data = ''

			resp.on('data', chunk => {
				data += chunk
			})

			resp.on('end', () => {
				try {
					const json = JSON.parse(data)
					resolve(json.results || json)
				} catch (e) {
					reject(`JSON parse error: ${e}`)
				}
			})

		}).on('error', err => {
			reject(`HTTP error: ${err}`)
		})
	})
}

async function fetchAndSave() {
	const results = []
	const seenLevels = new Set()

	for (let i = 0; i < terms.length; i++) {
		await sleep(3000)

		const term = terms[i]
		const url = baseUrl + term
		console.log(`fetching: ${url}`)

		try {
			const result = await fetchData(url)

			if (!Array.isArray(result)) {
				console.warn(`non-array result for "${term}":`, result)
				continue
			}

			if (result.length === 0) {
				console.log(`no results for: ${term}`)
				continue
			}

			for (const level of result) {
				const levelHash = md5(level.song + level.artist + level.charter)
				if (seenLevels.has(levelHash)) {
					console.log(`already seen: ${level.song} --- ${level.artist} --- ${level.charter}`) 
					continue
				}
				console.log(`added: ${level.song} --- ${level.artist} --- ${level.charter}`) 
				seenLevels.add(levelHash)
				results.push(level)
			}
		} catch (err) {
			console.error(`error at "${term}":`, err)
		}
	}

	try {
		const jsonData = JSON.stringify(results, null, 2)
		await fs.writeFile('levels.json', jsonData)
		console.log('saved results.')
	} catch (err) {
		console.error('error writing file:', err)
	}
}


fetchAndSave()
