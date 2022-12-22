/**
 * @description
 * This benchmark tests speed of property default setter.
 *
 * Note:
 * - For validate.js can't set default value. This library only validate
 * the object.
 */

const OBJECT_PROPERTIES_COUNT = 100

createGroup('Default setter', ({ objectParser }) => {
	const parserRawSchemaPrimitive = {}
	const parserRawSchemaNoPrimitive = {}

	for (let i = 0; i < OBJECT_PROPERTIES_COUNT; i++) {
		parserRawSchemaPrimitive[i] = objectParser.parser.property({
			required: false,
			default: 'Value' + i,
		})

		parserRawSchemaNoPrimitive[i] = objectParser.parser.property({
			required: false,
			default: () => [i],
		})
	}

	const objectParserSchemaPrimitive = objectParser.parser.schema(
		parserRawSchemaPrimitive
	)

	const objectParserSchemaNoPrimitive = objectParser.parser.schema(
		parserRawSchemaNoPrimitive
	)

	createTest('ObjectParser set primitive value', () => {
		objectParser.parser.parse({}, objectParserSchemaPrimitive)
	})

	createTest('ObjectParser set no primitive value', () => {
		objectParser.parser.parse({}, objectParserSchemaNoPrimitive)
	})
})
