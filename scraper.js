const https = require('https')
const fs = require('fs').promises
const md5 = require('md5')

const baseUrl = "https://beatblockbrowser.me/api/search/"
const terms = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ")

function fetchData(url) {
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
	const seenLevels = []

	for (let i = 0; i < terms.length; i++) {
		const url = baseUrl + terms[i]
		console.log(`fetching: ${url}`)
		try {
			const result = await fetchData(url)
			for (let j = 0; j < result.length; j++) {
				const level = result[j]
				const levelHash = md5(level.song + level.artist + level.charter)
				if (seenLevels.includes(levelHash)) {
					console.log(levelHash + " seen already: " + level.song + " " + level.artist + " " + level.charter)
					continue;
				}
				console.log(levelHash + " added " + level.song + " " + level.artist + " " + level.charter)

				seenLevels.push(levelHash)
				results.push(level)
			}
		} catch (err) {
			console.error(`error at "${terms[i]}"`, err)
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

