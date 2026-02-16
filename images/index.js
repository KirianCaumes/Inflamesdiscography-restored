const fs = require("fs")
const JSDOM = require('jsdom').JSDOM
const axios = require('axios').default

    ;
(async () => {
    const toPath = './data'
    const fromPath = '..'

    if (fs.existsSync(toPath))
        fs.rmSync(toPath, { recursive: true, force: true })

    fs.mkdirSync(toPath)

    const urls = [...new Set(
        fs
            .readdirSync(`${fromPath}/`)
            .filter(x => x.endsWith('html') || x.endsWith('htm'))
            .map(file => {
                const { document } = (new JSDOM(fs.readFileSync(`${fromPath}/${file}`).toString())).window
                return [...document.querySelectorAll('img')]
                    .map(img => img.parentElement?.href)
                    .filter(x => !!x)
            })
            .flat()
    )]

    // Add some missing urls that were not in the html files
    urls.push(...[
        "http://i120.photobucket.com/albums/o194/ryetallica/ASOP%20Thumbnails/ASOP%20Scans/ASOP-32a.jpg",
        "http://i120.photobucket.com/albums/o194/ryetallica/Come%20Clarity%20Thumbnails/Come%20Clarity%20Scans/CC-6b.jpg",
        "http://i120.photobucket.com/albums/o194/ryetallica/Come%20Clarity%20Thumbnails/Come%20Clarity%20Scans/CC-10a.jpg",
        "http://i120.photobucket.com/albums/o194/ryetallica/Jester%20Race%20Thumbnails/TJRBA-3c.jpg",
        "http://i120.photobucket.com/albums/o194/ryetallica/Jester%20Race%20Thumbnails/The%20Jester%20Race/TJR-5b.jpg",
        "http://i120.photobucket.com/albums/o194/ryetallica/Jester%20Race%20Thumbnails/The%20Jester%20Race/TJR-5a.jpg"
    ])

    console.log(`${urls.length} urls found`)

    for (const url of urls) {
        try {
            const res = await axios.get(url, {
                headers: { Referer: 'http://i120.photobucket.com/' },
                responseType: "arraybuffer",
            })

            fs.writeFileSync(
                `${toPath}/${decodeURIComponent(url).replace('http://i120.photobucket.com/albums/o194/ryetallica/', '').trim().replaceAll('/', '_')}`,
                res.data,
            )
            // console.log(url)
        } catch (error) {
            console.error(url)
        }
    }
})()