# ObjectPaser schemas

ObjectParser has 2 structures that are needed to parse objects: [ObjectSchema](../../api/types/schema.md) and [PropertySchema](../../api/types/property-schema.md). They describe what an object and its properties should be.

## Object schema

This schema type is used to describe object hierarchies and applied to an object. Use [.schema()](../../api/schema.md) to create.

Example:

```javascript
parser.schema({
  a: String,
  b: [Number, Number],
  c: {
    d: Function,
  },
})
```

The object that was passed to the function will be converted to a schema, where each property will be a property schema or a nested schema.

## Property schema

This type of schema is used to describe a property of an object and applied to an object property. Use [.property()](../../api/property.md) to create.

Example:

```javascript
parser.property({
  type: String,
  required: false,
  default: () => 'Hello World',
  validator: (val) => val.length > 0,
})
```

## Immutable

**All schemas are immutable**, which guarantees that they will not change properties at runtime and that two identical objects will have same results at different intervals.

Example:

```javascript
const propertySchema = parser.property({ type: String })
propertySchema.type = [Number, Boolean]
// => throws an error
```

## Combining

**All schemas are reusable**, which allows you to create complex structures from smaller ones and can completely remove the need to duplicate code. It also allows for more efficient use of memory.

Example:

```javascript
// Shared schemas

const id = parser.property({
  type: [Number, String],
})

const username = parser.property({
  type: String,
})

const tag = parser.schema({
  id,
  name: String,
})

const tags = parser.property({
  type: Array,
  element: tag,
})

// Other schemas

const userInfoSchema = parser.schema({
  id,
  name: userName,
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

In this example, we have created `id`, `username`, `tags` property schemas, where the tags schema depends on the `tag` object schema. And then, they used them in complex schemes `userInfoSchema` and `postDataSchema`.
