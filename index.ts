import { create, insert, search } from '@orama/orama'
import { persistToFile, restoreFromFile } from '@orama/plugin-data-persistence/server'

const imageSchema = {
    title: 'string',
    tags: 'string[]',
} as const

interface Image {
    title: string
    tags: string[]
    uri: string
    owner: string
}

// check if db.msp exists
let db = await create({ schema: imageSchema })
try {
    db = await restoreFromFile('binary', 'db.msp')
} catch (e) {
    console.log('No db.msp file found')
}

const searchResult = await search<typeof db, Image>(db, { term: 'example' })
console.log(searchResult.hits.map(hit => hit.document.title))

process.on('SIGINT', async () => {
    await persistToFile(db, 'binary', "db.msp")
    process.exit()
})

process.on("SIGTERM", async () => {
    await persistToFile(db, 'binary', "db.msp")
    process.exit()
})