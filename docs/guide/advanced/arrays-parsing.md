# Parse arrays

ObjectPaser supports validation of an array and its elements. To do this, you need to specify the **element** key in a property schema.

**Example for simple arrays:**

```javascript
// an array of strings
parser.property({
  type: Array,
  element: String,
})

// an array of strings with length > 0
parser.property({
  type: Array,
  element: parser.property({
    type: String,
    validator: (val) => val.length > 0,
  }),
})

// an array of objects with id and name props
parser.property({
  type: Array,
  element: parser.schema({
    id: Number,
    name: String,
  }),
})
```

**Example for multidimensional arrays:**

```javascript
// an array of number arrays
// [[1, 2, 3]]
parser.property({
  type: Array,
  element: parser.property({
    type: Array,
    element: Number,
  }),
})
```
