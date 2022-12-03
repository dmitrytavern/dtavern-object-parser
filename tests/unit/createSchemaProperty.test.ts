import { isSchemaProperty, createSchemaProperty } from '../../dist/object-parser'

const propertyFn = createSchemaProperty
const isPropertyFn = isSchemaProperty

it('is schema property', () => {
  const settings = propertyFn({})

  expect(isPropertyFn(settings)).toBeTruthy()
})

it('empty raw settings', () => {
  const settings = propertyFn({})

  expect(settings).toEqual({
    type: null,
    required: true,
    default: null,
    validator: null,
  })
})

it('setting type', () => {
  const settings = propertyFn({ type: String })

  expect(settings).toEqual({
    type: String,
    required: true,
    default: null,
    validator: null,
  })
})

it('setting reqired', () => {
  const settings = propertyFn({ required: false })

  expect(settings).toEqual({
    type: null,
    required: false,
    default: null,
    validator: null,
  })
})

it('setting default', () => {
  const settings = propertyFn({ required: false, default: 'def' })

  expect(settings).toEqual({
    type: null,
    required: false,
    default: 'def',
    validator: null,
  })
})

it('setting validator', () => {
  const fn = () => true
  const settings = propertyFn({ validator: fn })

  expect(settings).toEqual({
    type: null,
    required: true,
    default: null,
    validator: fn,
  })
})

it('check settings immutable', () => {
  const settings = propertyFn({})

  expect(() => { settings.type = String }).toThrow()
  expect(() => { settings['type'] = String }).toThrow()
  expect(() => { delete settings['type'] }).toThrow()
  expect(() => { Object.defineProperty(settings, 'type', { value: String }) }).toThrow()
})

it('check array type setting immutable', () => {
  const settings = propertyFn({ type: [String, Number] })

  expect(settings.type[0]).toBe(String)
  expect(settings.type[2]).toBe(undefined)
  expect(() => { settings.type[0] = Boolean }).toThrow()
  expect(() => {   settings.type[2] = Function }).toThrow()
  expect(() => { settings.type.push(Object) }).toThrow()
  expect(() => { settings.type.pop() }).toThrow()
  expect(() => { Object.defineProperty(settings.type, 3, { value: Symbol }) }).toThrow()
})
