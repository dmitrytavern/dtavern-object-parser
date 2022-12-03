import { parseProperty } from '../../dist/object-parser.js'

const propertyParseFn = parseProperty

it('schema is undefined', () => {
  const objectValue = 'value'
  const objectKey = 'target'
  const object = { [objectKey]: objectValue }

  const response = propertyParseFn(object, objectKey, undefined)

  expect(response.isChanged).toBeFalsy()
  expect(response.errors.length).toBe(1)
  expect(response.value).toBe(objectValue)
})

it('schema is null', () => {
  const objectValue = 'value'
  const objectKey = 'target'
  const object = { [objectKey]: objectValue }

  const response = propertyParseFn(object, objectKey, null)

  expect(response.isChanged).toBeFalsy()
  expect(response.errors.length).toBe(1)
  expect(response.value).toBe(objectValue)
})

describe('schema is empty object', () => {
  const objectKey = 'target'

  it('object have property', () => {
    const objectValue = 'value'
    const object = { [objectKey]: objectValue }
  
    const response = propertyParseFn(object, objectKey, {})
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(0)
    expect(response.value).toBe(objectValue)
  })

  it('object not have property', () => {
    const object = {}
  
    const response = propertyParseFn(object, objectKey, {})
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(1)
    expect(response.value).toBe(undefined)
  })
})

describe('schema have only type', () => {
  it('type is valid', () => {
    const objectValue = 'value'
    const objectKey = 'target'
    const object = { [objectKey]: objectValue }
  
    const response = propertyParseFn(object, objectKey, {
      type: String
    })
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(0)
    expect(response.value).toBe(objectValue)
  })

  it('type is not valid', () => {
    const objectValue = 'value'
    const objectKey = 'target'
    const object = { [objectKey]: objectValue }
  
    const response = propertyParseFn(object, objectKey, {
      type: Number
    })
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(1)
    expect(response.value).toBe(objectValue)
  })

  it('schema type is not valid', () => {
    const objectValue = 'value'
    const objectKey = 'target'
    const object = { [objectKey]: objectValue }
  
    const response = propertyParseFn(object, objectKey, {
      type: false
    })    
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(1)
    expect(response.value).toBe(objectValue)
  })
})

describe('schema have only required', () => {
  const objectKey = 'target'
  const schemaTrue = { required: true }
  const schemaFalse = { required: false }

  it('object have property with required', () => {
    const objectValue = 'Hello world'
    const object = { [objectKey]: objectValue }
  
    const response = propertyParseFn(object, objectKey, schemaTrue)
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(0)
    expect(response.value).toBe(objectValue)
  })

  it('object not have property with required', () => {
    const object = {}
  
    const response = propertyParseFn(object, objectKey, schemaTrue)
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(1)
    expect(response.value).toBe(undefined)
  })

  it('object not have property without required', () => {
    const object = {}
  
    const response = propertyParseFn(object, objectKey, schemaFalse)
  
    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(0)
    expect(response.value).toBe(undefined)
  })
})

describe('schema have default', () => {
  const objectKey = 'target'
  const objectValue = 'Hello world'
  const schema = {
    required: false,
    default: objectValue,
  }

  it('object have property', () => {
    const object = { [objectKey]: objectValue }

    const response = propertyParseFn(object, objectKey, schema)

    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(0)
    expect(response.value).toBe(objectValue)
  })

  it('object not have property', () => {
    const object = {}

    const response = propertyParseFn(object, objectKey, schema)

    expect(response.isChanged).toBeTruthy()
    expect(response.errors.length).toBe(0)
    expect(response.value).toBe(objectValue)
  })
})

describe('schema have only validator', () => {
  const objectKey = 'target'
  const objectValue = 'Hello world'
  const object = { [objectKey]: objectValue }

  it('return true', () => {
    const response = propertyParseFn(object, objectKey, {
      validator: () => true
    })

    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(0)
    expect(response.value).toBe(objectValue)
  })

  it('return false', () => {
    const response = propertyParseFn(object, objectKey, {
      validator: () => false
    })

    expect(response.isChanged).toBeFalsy()
    expect(response.errors.length).toBe(1)
    expect(response.value).toBe(objectValue)
  })
})
