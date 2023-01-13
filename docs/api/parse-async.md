# .parseAsync(object, schema, [options])

Same as [.parse()](./parse.md), but returns a `Promise`.

- `object` - parsing target. Can be `null`, `undefined` or `object`.
- `schema` - schema created via [.schema()](./schema.md) or raw `object`.
- `[options]` - optional settings:
  - `clone` - when true, creates a new object and makes a deep clone of the original object.

:::warning Warning!
Don't use a **raw object** for schema attribute in production, because every function call will re-create a schema and doesn't cache it. **It's very bad for performance**.
:::

## General usage

Unlike [.parse()](./parse.md), this function returns a `Promise`. If there are no errors, then the function passed to `.then` will be called, otherwise an exception will be thrown.

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

Since the return value is a `Promise`, it supports async/await ES6 syntax:

```javascript
const apiUrl = 'https://api.npms.io/v2/search?q=parser'
const dataSchema = parser.schema({
  total: Number,
  results: Array,
})

async function fetchSome() {
  const rawData = await fetch(apiUrl).then((response) => response.json())

  const data = await parser.parseAsync(rawData, dataSchema)

  return data
}

fetchSome()
  .than((data) => console.log(data))
  .catch((errors) => console.error(errors))
// => prints a data or errors
```
