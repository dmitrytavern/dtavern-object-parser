/**
 * @description
 * This benchmark tests speed of property type validator.
 *
 * Note:
 * - For validate.js was created custom validators: array and types. This library
 * does have not these validators out of the box.
 */

createGroup('Type validator', ({ objectParser, validateParser }) => {
  const object = {
    id: 1,
    first_name: 'Jack',
    last_name: 'Blank',
    avatar_urls: {
      small: 'https://example.com',
      large: 'https://example.com',
      medium: 'https://example.com',
    },
    roles: [
      {
        id: '1',
        name: 'user',
        priority: 1,
      },
      {
        id: '2',
        name: 'admin',
        priority: 1000,
      },
    ],
  }

  const objectParserSchema = objectParser.parser.schema({
    id: Number,
    first_name: String,
    last_name: String,
    avatar_urls: {
      small: String,
      large: String,
      medium: String,
    },
    roles: objectParser.parser.property({
      type: Array,
      element: objectParser.parser.schema({
        id: [Number, String],
        name: String,
        priority: Number,
      }),
    }),
  })

  const validateParserSchema = {
    id: {
      type: 'number',
    },
    first_name: {
      type: 'string',
    },
    last_name: {
      type: 'string',
    },
    'avatar_urls.small': {
      type: 'string',
    },
    'avatar_urls.large': {
      type: 'string',
    },
    'avatar_urls.medium': {
      type: 'string',
    },
    roles: {
      array: {
        id: {
          types: ['number', 'string'],
        },
        name: {
          types: ['number', 'string'],
        },
        priority: {
          types: ['number', 'string'],
        },
      },
    },
  }

  createTest('ObjectParser', () => {
    objectParser.parser.parse(object, objectParserSchema)
  })

  createTest('Validate.js', () => {
    validateParser(object, validateParserSchema)
  })
})
