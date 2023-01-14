# Installation

## Via npm

ObjectParser is available via [npm](https://www.npmjs.com/package/@dmitrytavern/object-parser):

```
npm install --save @dmitrytavern/object-parser
```

Usage:

```javascript
// Node.js
const parser = require('@dmitrytavern/object-parser')
const { parser } = require('@dmitrytavern/object-parser')
const { parse, schema, property } = require('@dmitrytavern/object-parser')

// ES6
import parser from '@dmitrytavern/object-parser'
import { parser } from '@dmitrytavern/object-parser'
import { parse, schema, property } from '@dmitrytavern/object-parser'
```

## Browser/CDN

To connect ObjectParser to the site, copy and paste this script:

```html
<script src="https://unpkg.com/@dmitrytavern/object-parser@2.0.0/dist/object-parser.min.js"></script>
```

Usage:

```html
<script>
  const parser = window.objectParser
  const { parser } = window.objectParser
  const { parse, schema, property } = window.objectParser
</script>
```

## GitHub assets

You can download ObjectParser from [GitHub assets](https://github.com/dmitrytavern/dtavern-options/releases/tag/v2.0.0).
