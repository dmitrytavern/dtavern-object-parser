/**
 * @description
 * This benchmark tests speed of property custom validator.
 */

createGroup('Custom validator', ({ objectParser, validateParser }) => {
	const OBJECT_PROPERTIES_COUNT = 100
	const object = {}
	const parserRawSchema = {}
	const validateParserSchema = {}

	for (let i = 0; i < OBJECT_PROPERTIES_COUNT; i++) {
		object[i] = 'Value' + i

		parserRawSchema[i] = objectParser.parser.property({
			validator: (value) => value === 'Value' + i,
		})

		validateParserSchema[i] = {
			validator: i,
		}
	}

	validateParser &&
		(validateParser.validators.validator = function (value, index) {
			if (value === 'Value' + index) return null
			return 'is wrong'
		})

	const objectParserSchema = objectParser.parser.schema(parserRawSchema)

	createTest('ObjectParser', () => {
		objectParser.parser.parse(object, objectParserSchema)
	})

	createTest('Validate.js', () => {
		validateParser(object, validateParserSchema)
	})
})
