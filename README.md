# BetterBrowser for BeatblockBrowser
[Beatblock Browser](https://beatblockbrowser.me/) is a website that lets you browse Beatblock levels, however, there is no option to just go through random maps without searching for anything, and the site has a lot of duplicate levels.\
BetterBrowser is a small script that you can use to display all levels on the website.

# Usage
- First, you must search for any term on the website, it doesn't matter what it is.
![image](https://github.com/user-attachments/assets/8b6d90e9-42d5-40ba-a6e6-7a2a6cadd5b4)

- Next, open the developer console. The key is usually `F12`, but it may differ between browsers.
![image](https://github.com/user-attachments/assets/78209d82-e76a-4ff3-89f0-83e20de57317)

- Lastly, paste this script in the console and hit enter.
```js
(async () => {
	// load level data
	const levelsRes = await fetch("https://raw.githubusercontent.com/BeatblockTools/BetterBrowser/refs/heads/main/levels.json")
	if (!levelsRes.ok) {
		throw new Error(`Response status: ${levelsRes.status}`)
	}
	const levels = await levelsRes.json()

	// render them
	const songData = await import('./js/songdata.js')

	const resultsContainer = document.getElementById('search-results')
	const template = document.getElementById('search-result-template')
	resultsContainer.innerHTML = ''
	document.getElementById("search-query").innerText = "All!!!"

	let i = 0
	levels.forEach(level => {
		const clone = template.content.cloneNode(true)
		songData.updateSongCard(clone, level)
		resultsContainer.appendChild(clone)
		i++
	})
	console.log("loaded " + i + " levels!")
})()
```

- Enjoy!


For any issues, contact us on [Beatblock Modding Community](https://discord.gg/VDvPUSCdGZ)
