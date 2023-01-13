require('./core')

loadPackage({
  name: 'Object Parser',
  contextName: 'objectParser',
  modulePath: '../dist/object-parser.min.js',
  version: (module) => module.version.toString(),
})

loadPackage({
  name: 'Validate.js',
  contextName: 'validateParser',
  modulePath: 'validate.js',
  version: (module) => module.version.toString(),
  config: (module) => {
    module.validators.array = (arrayItems, itemConstraints) => {
      const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
        const error = module(item, itemConstraints)
        if (error) errors[index] = { error: error }
        return errors
      }, {})

      return arrayItemErrors.length === 0 ? null : { errors: arrayItemErrors }
    }

    module.validators.types = (value, arrayOfType) => {
      for (const type of arrayOfType) {
        if (module.single(value, { presence: true, type }) === undefined)
          return null
      }

      return { errors: 'Value type is wrong' }
    }
  },
})

require('./groups/existence')
require('./groups/type')
require('./groups/default')
require('./groups/validator')
require('./groups/clone')

require('./bootstrap')
require('./markdown')

process.argv[2] === '--write' ? markdown() : bootstrap()
