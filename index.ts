import { create, insert, search } from '@orama/orama'
import { persistToFile, restoreFromFile } from '@orama/plugin-data-persistence/server'

import Elysia from 'elysia'

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
console.log("🚀 Starting server")

// check if db.msp exists
console.log("⛁  Loading db")
let db = await create({ schema: imageSchema })
try {
    db = await restoreFromFile('binary', 'db.msp')
} catch (e) {
    console.log('❌ No db.msp file found; creating new db')
}
console.log("✅ db loaded")

console.log("⚙️  Setting up handlers")
process.on('SIGINT', async () => {
    await persistToFile(db, 'binary', "db.msp")
    process.exit()
})

process.on("SIGTERM", async () => {
    await persistToFile(db, 'binary', "db.msp")
    process.exit()
})

console.log("✅ Handlers set up")

// start elysia
console.log("🦊 Starting Elysia")

const elysia = new Elysia()
    .get('/', () => "Hello from Elysia! 🦊")
    .get('/query', async ({ request }) => {
        // get search query
        const { userID, query } = await request.json()
        const bearer = request.headers.get('Authorization');

        // check if user is authenticated
        if (bearer !== process.env.TOKEN) {
            return { error: 'Unauthorized' }
        }

        if (!userID || !query) {
            return { error: 'Invalid query' }
        }

        // search for images
        const results = await search<typeof db, Image>(db, query)
        const images = results.hits.map((hit) => hit.document)

        return images.filter((image) => image.owner === userID)
    })
    .post('/insert', async ({ request }) => {
        // get image data
        const { title, tags, uri, owner } = await request.json()
        const bearer = request.headers.get('Authorization');

        // check if user is authenticated
        if (bearer !== process.env.TOKEN) {
            return { error: 'Unauthorized' }
        }

        // ensure that image has the same type as the interface Image
        if (!title || !tags || !uri || !owner) {
            return { error: 'Invalid image data' }
        }

        // insert image into db
        try {
            await insert(db, { title, tags, uri, owner })
        } catch (e) {
            return { error: 'Failed to insert image' }
        }

        return { success: true }
    })
    .listen(4221)

console.log("✅ Elysia started at http://localhost:4221")

