# .schema(object)

Creates a schema for parse functions.

- `object` - the object to create a schema or an array of string.

## Object schema

Schema creates by an object, where properies can be: a `constructor`, `array of constructors`, `schema`, `property schema` or `nested object`.

```
{
  <property-name>: null

  <property-name>: undefined

  <property-name>: String

  <property-name>: [String, Boolean]

  <property-name>: parser.schema()

  <property-name>: parser.property()

  <property-name>: {
    <property-name>: String

    <property-name>: [String, Boolean]

    ...
  }
}
```

Examples:

```javascript
// Standart schema.
const schema_1 = parser.schema({
  a: String,

  b: [String, Boolean],

  c: {
    d: String.
  }
})

// Combination of schemas
const schema_2 = parser.schema({
  i: schema_1,

  f: parser.property(null)
})
```

## Array schema

Schema creates by an array with string.

```
[
  'a'
  'a.b'
  'c.d.f'
]
```

Examples:

```javascript
parser.schema(['a', 'a.b', 'c.d'])
// => {
//   a: {
//     b: null
//   },
//   c: {
//     d: null
//   }
// }
```

## Error handling

```javascript
parser.schema(undefined)
// => throwns an error

parser.schema({ a: 'string' })
// => throwns an error

const obj = { a: { b: {} } }
obj.a.b.c = obj
parser.schema(obj)
// => throwns an error (a circular structure)
```
