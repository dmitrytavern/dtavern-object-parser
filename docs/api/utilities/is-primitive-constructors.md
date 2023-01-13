# .utils.isPrimitiveConstructors(constructors)

Returns `true` if the argument is a **primitive constructor** or an **array of primitive constructors**, otherwise returns `false`.

Primitive constructors: `String`, `Number`, `Boolean`, `BigInt`, `Symbol`.

Usage exmaple:

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

:::info Note
If you pass `null` or `undefined` type, the function returns false. These types are not a constructor.
:::
