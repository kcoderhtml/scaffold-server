# scaffold-server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

You can insert an image like this:

```bash
curl -X POST -H "Authorization: supersecrettoken" http://localhost:4221/insert -d '{"title": "special image", "tags": ["sparkles", "red"], "uri": "file:///smwhere", "owner": "kieran"}'
```

or as a fetch:

```typescript
fetch('http://localhost:4221/insert', {
    method: 'POST',
    headers: {
        'Authorization': 'supersecrettoken',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'special image',
        tags: ['sparkles', 'red'],
        uri: 'file:///smwhere',
        owner: 'kieran'
    })
})
```

To query the db:

```bash
curl -X POST -H "Authorization: supersecrettoken" http://localhost:4221/query -d '{"userID": "kieran", "query": "special"}'
```

or as a fetch:

```typescript
fetch('http://localhost:4221/query', {
    method: 'POST',
    headers: {
        'Authorization': 'supersecrettoken',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userID: 'kieran',
        query: 'special'
    })
})
```
