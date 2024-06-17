import { create, insert, search } from '@orama/orama'
import { persist, restore } from '@orama/plugin-data-persistence'

const movieSchema = {
    title: 'string',
} as const
const db = await create({ schema: movieSchema })

interface Movie {
    title: string,
    year: number,
}

await insert(db, { title: 'The Matrix', year: 1999 })
await insert(db, { title: 'Inception', year: 2010 })
await insert(db, { title: 'Interstellar', year: 2014 })
await insert(db, { title: 'Tenet', year: 2020 })
await insert(db, { title: 'Dune', year: 2021 })
await insert(db, { title: 'The Matrix Resurrections', year: 2021 })

const searchResult = await search<typeof db, Movie>(db, { term: 'Matrix' })

console.log(searchResult.hits.map(hit => hit.document.title))