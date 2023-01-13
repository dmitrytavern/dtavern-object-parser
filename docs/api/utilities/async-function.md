# .utils.AsyncFunction

The async function constructor for property schema types. See [AsyncFunctionConstructor](../types/async-function-constructor.md).

Usage example:

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
// => a 'callback' property is valid
```
