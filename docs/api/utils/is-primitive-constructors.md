# .utils.isPrimitiveConstructors(constructors)

Returns `true` if the argument is a primitive constructor or the array of primitive constructors, otherwise returns `false`.

Primitive constructors: `String`, `Number`, `Boolean`, `BigInt`, `Symbol`.

Note:

- If you pass `null` or `undefined` type, returns false. These types are not
  a constructor.
- If you pass an empty array, returns `false`.

Exmaple:

```javascript
isPrimitiveConstructors(String)
// => true

isPrimitiveConstructors(null)
isPrimitiveConstructors(undefined)
isPrimitiveConstructors(Object)
isPrimitiveConstructors([])
isPrimitiveConstructors([String, Object])
// => false
```
