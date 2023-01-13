# .utils.isConstructors(constructors)

Returns `true` if the argument is a [Constructor](../types/constructor.md) or an **array of constructors** (see [Constructor[]](../types/constructor.md)), otherwise returns `false`.

Usage example:

```javascript
isConstructors(String)
isConstructors('Hello')
// => true

isConstructors([])
isConstructors([[]])
isConstructors([String, null])
// => false
```

:::info Note
If you pass an empty array, the function returns `false`. It is more correct and prevents the case when this function returns `true` when the value for a check is an empty array.
:::
