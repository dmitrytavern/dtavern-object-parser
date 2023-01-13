# .schema(object)

Creates an object schema.

- `object` - a raw object or an array of strings. See [RawSchema](./types/raw-schema.md) type.

## Schema from a raw object

Schema creates by an object, where properies can be: [Constructor](./types/constructor.md), [Constructor[]](./types/constructor.md), [Schema](./types/schema.md), [PropertySchema](./types/property-schema.md) or **nested object**.

Structure example:

```
{
  // Creates a default property schema
  <property-name>: null

  // Creates a default property schema
  <property-name>: undefined

  // Creates a property schema where type is String
  <property-name>: String

  // Creates a property schema where type is String and Boolean
  <property-name>: [String, Boolean]

  // Uses a created nested schema
  <property-name>: parser.schema()

  // Uses a created property schema
  <property-name>: parser.property()

  // Creates a nested schema
  <property-name>: {
    <property-name>: String

    <property-name>: [String, Boolean]

    ...
  }
}
```

Code example:

```javascript
parser.schema({
  a: null,
  b: undefined,
  c: String,
  d: [String, Boolean],
  i: parser.schema({}),
  f: parser.property({}),
  g: {
    a: String,
    b: [String, Boolean],
  },
})
```

:::tip Recommendation
If you are using already created schemes, they will **not be re-created**. Since schemas are immutable, they can be combined to minimize memory usage.
:::

## Schema from an array

Schema creates by an array of strings.

Structure example:

```
[
  'a'
  'a.b'
  'c.d.f'
]
```

Code example:

```javascript
parser.schema(['a', 'a.b', 'c.d'])
// => {
//   a: {
//     b: parser.property(null) // A default schema property
//   },
//   c: {
//     d: parser.property(null) // A default schema property
//   }
// }
```

## Error handling

If the attribute is invalid, the properties of the object will be of the wrong type, or the object will have a circular structure - throws.

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
