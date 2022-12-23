/**
 * @description
 * This benchmark tests speed of cloning the object.
 *
 * Note:
 * - For validate.js can't clone original object.
 */

const OBJECT_PROPERTIES_COUNT = 250

createGroup('Clone object', ({ objectParser }) => {
	const object = {}
	const parserRawSchema = {}

	for (let i = 0; i < OBJECT_PROPERTIES_COUNT; i++) {
		object[i] = 'Value' + i
		parserRawSchema[i] = null
	}

	const objectParserSchema = objectParser.parser.schema(parserRawSchema)

	createTest('ObjectParser', () => {
		objectParser.parser.parse(object, objectParserSchema)
	})
})
