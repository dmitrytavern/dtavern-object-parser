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
})

require('./groups/existance')

require('./bootstrap')

bootstrap()
