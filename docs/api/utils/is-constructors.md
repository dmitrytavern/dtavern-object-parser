# .utils.isConstructors(constructors)

Returns `true` if the argument is a constructor or the array of constructors, otherwise returns `false`.

Note: if you pass an empty array, returns `false`. It is more correct and prevents the case when this function returns `true` when the value for a check is an empty array.

Example:

```javascript
isConstructors(String)
isConstructors('Hello')
// => true

isConstructors([])
isConstructors([[]])
isConstructors([String, null])
// => false
```
