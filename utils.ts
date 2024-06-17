import type { Database } from "bun:sqlite";

export async function generateToken(tokenDB: Database) {
    // generate crypto.randomUUID() and check if it already exists in the db to avoid duplicates
    let token = crypto.randomUUID()
    while (tokenDB.prepare('SELECT * FROM tokens WHERE token = ?').get(token)) {
        token = crypto.randomUUID()
    }

    return token
}