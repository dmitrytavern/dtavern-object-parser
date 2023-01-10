# **General Usage**

ObjectParser is designed to guarantee the structure of an object according to a particular scheme. This means that the parser will return an object with properties specified in the schema that has the specified type, that has been validated (if needed), and that exists (if it should).

## Functions

The following functions are used for parsing:

- `.parse()` - parses the object according to the schema. See [docs](../api/parse.md).
- `.parseAsync()` - asynchronous object parsing according to the scheme. See [docs](../api/parse-async.md).
- `.single()` - parses an object property by property schema. See [docs](../api/single.md).

The idea is that each function uses schemas to parse an object or its property. Therefore, let's move on to the structures

_Note: for more detailed information on each function, read the documentation for it._

## Structures

ObjectParser has 2 structures which needed to parse objects:

- `Schema` - applied to the object. Describes the hierarchy of an object. Use [.schema()](../api/schema.md) to create.

- `PropertySchema` - applied to an object property. Sets a property on an object. Use [.property()](../api/property.md) to create.

Example:

```javascript
const propertySchema = parser.property({
  type: String,
})

const schema = parser.schema({
  a: propertySchema,
})

// Means, that there must be an object with a single property 'a' with a string type.
```

**These schemas are immutable**, which guarantees that they will not change properties at runtime and that one and two identical objects will have different results at different intervals.

Example:

```javascript
const propertySchema = parser.property({ type: String })
propertySchema.type = [Number, Boolean]
// => throws an error
```

**These structures are reusable.** This allows you to create complex structures from smaller ones and can completely remove the need to duplicate code. It also allows for more efficient use of memory.

Example:

```javascript
// Shared schemas

const id = parser.property({
  type: [Number, String],
})

const userName = parser.property({
  type: String,
  validator: (name) => {
    if (!name.match(/^[a-zA-Z]+$/))
      throw new Error('Invalid characters. Use only letters')
    return true
  },
})

const userEmail = parser.property({
  type: String,
  validator: (email) => {
    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      throw new Error('Invalid email')
    return true
  },
})

const tags = parser.property({
  type: Array,
  element: parser.schema({
    id,
    name: String,
  }),
})

// Other schemas

const userInfoSchema = parser.schema({
  id,
  name: userName,
  email: userEmail,
})

const postDataSchema = parser.schema({
  id,
  tags,
  title: String,
  user: {
    name: userInfoSchema.name,
  },
})
```

In this example, we have created `id`, `userName`, `userEmail`, `tags` property schemas. And then, they used them in more complex schemes `userInfoSchema` and `postDataSchema`.
