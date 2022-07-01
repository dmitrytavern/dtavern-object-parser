# JS Options Parser

A very light-weight options parser for node or web. How props in
vue.js. With:

- **Exists checker**
- **Type checker**
- **Custom validator**
- **Default setter**

## Usage

```
npm i @dtavern/options
```

```js
const { defineOptions } = require('@dtavern/options')

class Animal {
	constructor(options) {
		defineOptions(options, {
			name: String,
		})

		console.log(options)
	}
}

new Animal({
	name: 'Rocket',
})

// output: {name: 'Rocket'}
```

How you can see, `defineOptions` **overwrite original object**. If you need
clone object, use spread operator.

## API

### **Settings as array**

If you need to use only existing checkers, you can use settings as an array.

Example:

```js
const { defineOptions } = require('@dtavern/options')

// throw error
defineOptions({}, ['name'])

// throw error
defineOptions({ name: 'any type' }, [])

// Returns { name: 'any type' }
defineOptions({ name: 'any type' }, ['name'])
```

### **Settings as object**

If you need to use checkers of existing and typing, you can use settings
as an object.

Example:

```js
const { defineOptions } = require('@dtavern/options')

// Returns { name: 'any type' }
defineOptions({ name: 'any type' }, { name: String })

// Returns { age: 17 }
defineOptions({ age: 17 }, { age: [String, Number] })

// Returns { _null: 17 } - skip type checker
defineOptions({ _null: 17 }, { _null: null })
```

You need to use **classes** as the value of settings.

### **Option settings as object**

if you need more fine tuning you can use option settings as object.

Example:

```js
const { defineOptions } = require('@dtavern/options')

// Returns { name: 'hello' }
defineOptions(
	{},
	{
		name: {
			type: String,
			required: false,
			default: 'hello',
			validator: (value) => value.length > 0,
		},
	}
)
```

Options:

#### **type**

Type: `class` | `array` of classes\
Default: `null`

Use for checking property value with the class constructor.

```js
name: {
  type: String,
}

age: {
  type: [String, Number],
}
```

You can use any classes.

#### **required**

Type: `boolean`\
Default: `true`

If required is false and properties have no needs key,
throw error will not happen

```js
root: {
  type: Boolean,
  required: false
}
```

#### **default**

Type: `function` | `any`\
Default: `null`

If required is false and properties have no needs key, you can
set default value. It can be both primitives and objects.

Note: for objects, I recommend using the function. Also, if
the default the value will not be the correct type or if the
validator doesn't miss it, this will result in an error.

```js
color: {
  type: String,
  required: false,
  default: 'red'
}

colors: {
  type: Array,
  required: false,
  default: () => ['red', 'blue']
}
```

#### **validator**

Type: `function`\
Arguments: `(value: any)`\
Returns: `boolean`\
Default: `null`

If you need to check property value to allowable values, you
can use custom validator.

```js
colors: {
  type: String,
  required: false,
  default: () => 'red',
  validator: (value) => ['red', 'blue'].includes(value)
}
```
