// This test needs for check performance of existance props in object.
//

const OBJECT_PROPERTIES_COUNT = 100
const OBJECT_PROPERTIES_COUNT_OVERLOAD = 500

createGroup('Existance validator', ({ objectParser, validateParser }) => {
	const object = {}
	const parserRawSchema = {}
	const validateParserSchema = {}

	for (let i = 0; i < OBJECT_PROPERTIES_COUNT; i++) {
		object[i] = 'Value#' + i
		parserRawSchema[i] = null
		validateParserSchema[i] = { presence: true }
	}

	const parserSchema = objectParser.parser.schema(parserRawSchema)

	createTest('ObjectParser with raw schema', () => {
		objectParser.parser.parse(object, parserRawSchema)
	})

	createTest('ObjectParser with schema', () => {
		objectParser.parser.parse(object, parserSchema)
	})

	validateParser &&
		createTest('Validate.js', () => {
			validateParser(object, validateParserSchema)
		})
})

createGroup(
	'Existance validator [overload]',
	({ objectParser, validateParser }) => {
		const object = {}
		const parserRawSchema = {}
		const validateParserSchema = {}

		for (let i = 0; i < OBJECT_PROPERTIES_COUNT_OVERLOAD; i++) {
			object[i] = 'Value#' + i
			parserRawSchema[i] = null
			validateParserSchema[i] = { presence: true }
		}

		const parserSchema = objectParser.parser.schema(parserRawSchema)

		createTest('ObjectParser with raw schema', () => {
			objectParser.parser.parse(object, parserRawSchema)
		})

		createTest('ObjectParser with schema', () => {
			objectParser.parser.parse(object, parserSchema)
		})

		validateParser &&
			createTest('Validate.js', () => {
				validateParser(object, validateParserSchema)
			})
	}
)
