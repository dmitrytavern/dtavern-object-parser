# .parseAsync(object, schema, [options])

Same as [.parse()](./parse.md), but returns Promise.

- `object` - parsing target. Can be `null`, `undefined` or `object`.
- `schema` - schema created via [.schema()](./schema.md) or raw `object`. Note: don't use raw schema, because every function call will re-create a schema.
- `[options]` - optional settings:
  - `clone` - when true, creates a new object and makes a deep clone of the original object. Note: default values from schema write to a new object and ignore the original object.

## General usage

```javascript
const object = { a: 'Hello World' }

const schema = parser.schema({ a: String })

parser
  .parseAsync(object, schema)
  .then((value) => {
    console.log(value)
  })
  .catch((errors) => {
    console.error(errors)
  })

// => { a: 'Hello World' }
```

For more examples, see [.parse()](./parse.md).

## Async/Await

```javascript
const dataSchema = parser.schema({
  results: Array,
  total: Number,
})

async function fetchSome() {
  try {
    const rawData = await fetch('https://api.npms.io/v2/search?q=parser').then(
      (response) => response.json()
    )

    const data = await parser.parse(rawData, dataSchema)

    return data
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const result = fetchSome()
// => data or undefined
```
