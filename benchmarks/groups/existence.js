/**
 * @description
 * This benchmark tests speed of property existence validator.
 */

const OBJECT_PROPERTIES_COUNT = 250
const OBJECT_PROPERTIES_NESTED_LENGTH = 100

createGroup('Existence validator', ({ objectParser, validateParser }) => {
	const object = {}
	const parserRawSchema = {}
	const parserRawSchemaArr = []
	const validateParserSchema = {}

	for (let i = 0; i < OBJECT_PROPERTIES_COUNT; i++) {
		object[i] = 'Value#' + i
		parserRawSchema[i] = null
		validateParserSchema[i] = { presence: true }
		parserRawSchemaArr.push(i + '')
	}

	const parserSchema = objectParser.parser.schema(parserRawSchema)

	createTest('ObjectParser with raw array schema', () => {
		objectParser.parser.parse(object, parserRawSchemaArr)
	})

	createTest('ObjectParser with raw schema', () => {
		objectParser.parser.parse(object, parserRawSchema)
	})

	createTest('ObjectParser with schema', () => {
		objectParser.parser.parse(object, parserSchema)
	})

	createTest('Validate.js', () => {
		validateParser(object, validateParserSchema)
	})
})

createGroup(
	'Existence validator of nested object',
	({ objectParser, validateParser }) => {
		const key = 'target'
		const object = {}
		const parserRawSchema = {}
		const validateParserSchema = {}

		let tmpObj = object
		let tmpRawSchema = parserRawSchema
		let tmpValidatePath = []
		for (let i = 0; i < OBJECT_PROPERTIES_NESTED_LENGTH; i++) {
			const propName = 'prop' + i
			tmpObj[propName] = {}
			tmpObj = tmpObj[propName]
			tmpRawSchema[propName] = {}
			tmpRawSchema = tmpRawSchema[propName]
			tmpValidatePath.push(propName)
		}

		const propPath = tmpValidatePath.join('.')
		tmpObj[key] = null
		tmpRawSchema[key] = null
		tmpValidatePath.push(key)
		validateParserSchema[propPath] = { presence: true }

		const parserSchema = objectParser.parser.schema(parserRawSchema)

		createTest('ObjectParser with schema', () => {
			objectParser.parser.parse(object, parserSchema)
		})

		createTest('Validate.js', () => {
			validateParser(object, validateParserSchema)
		})
	}
)
