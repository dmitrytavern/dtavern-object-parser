# .utils.AsyncFunction

The async function constructor for a property schema types.

Example:

```javascript
parser.parse(
  {
    callback: async () => {
      await something()
    },
  },
  {
    callback: parser.utils.AsyncFunction,
  }
)
// => callback property is valid
```
