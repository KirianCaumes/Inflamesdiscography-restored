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

    console.log(`${urls.length} urls found`)

    for (const url of urls) {
        try {
            const res = await axios.get(url, {
                headers: { Referer: 'http://i120.photobucket.com/' },
                responseType: "arraybuffer",
            })   

            fs.writeFileSync(
                `${toPath}/${url.split('/')?.pop()}`,
                res.data,
            )  
            console.log(url)       
        } catch (error) {
            console.error(url)            
        }
    }
})()