import { createRequire } from 'module'
import { defineConfig } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export const nav = [
  {
    text: 'Guide',
    link: '/guide/what-is-object-parser',
    activeMatch: '/guide/',
  },
  { text: 'API', link: '/api/', activeMatch: '/api/' },
  { text: 'Changelog', link: '/changelog' },
]

export const sidebar = {
  '/guide/': [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        { text: 'What is ObjectParser?', link: '/guide/what-is-object-parser' },
        { text: 'Installation', link: '/guide/installation' },
      ],
    },
    {
      text: 'Getting Started',
      collapsible: true,
      items: [
        { text: 'Quick Start', link: '/guide/getting-started/quick-start' },
        { text: 'Schemas', link: '/guide/getting-started/schemas' },
        { text: 'Methods', link: '/guide/getting-started/methods' },
      ],
    },
    {
      text: 'Advanced',
      collapsible: true,
      items: [
        { text: 'Arrays parsing', link: '/guide/advanced/arrays-parsing' },
        { text: 'Types upcasting', link: '/guide/advanced/types-upcasting' },
        { text: 'Typescript support', link: '/guide/advanced/typescript' },
        { text: 'Benchmarks', link: '/guide/advanced/benchmarks' },
      ],
    },
    {
      text: 'Extra Topics',
      collapsible: true,
      items: [
        { text: 'API', link: '/api/' },
        { text: 'Changelog', link: '/changelog' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'Core',
      collapsible: true,
      items: [
        { text: '.parse()', link: '/api/parse' },
        { text: '.parseAsync()', link: '/api/parse-async' },
        { text: '.single()', link: '/api/single' },
        { text: '.schema()', link: '/api/schema' },
        { text: '.property()', link: '/api/property' },
      ],
    },
    {
      text: 'Extra',
      collapsible: true,
      items: [
        { text: '.useSchema()', link: '/api/extra/use-schema' },
        { text: '.useProperty()', link: '/api/extra/use-property' },
        { text: '.isSchema()', link: '/api/extra/is-schema' },
        { text: '.isProperty()', link: '/api/extra/is-property' },
        { text: '.version', link: '/api/extra/version' },
      ],
    },
    {
      text: 'Utilities',
      collapsible: true,
      items: [
        { text: '.utils.AsyncFunction', link: '/api/utilities/async-function' },
        {
          text: '.utils.GeneratorFunction',
          link: '/api/utilities/generator-function',
        },
        { text: '.utils.Errors', link: '/api/utilities/errors' },
        {
          text: '.utils.getConstructors()',
          link: '/api/utilities/get-constructors',
        },
        {
          text: '.utils.isConstructors()',
          link: '/api/utilities/is-constructors',
        },
        {
          text: '.utils.isPrimitiveConstructors()',
          link: '/api/utilities/is-primitive-constructors',
        },
      ],
    },
    {
      text: 'Types',
      collapsible: true,
      items: [
        { text: 'Schema', link: '/api/types/schema' },
        { text: 'SchemaReturn', link: '/api/types/schema-return' },
        { text: 'SchemaReturnKeys', link: '/api/types/schema-return-keys' },
        { text: 'RawSchema', link: '/api/types/raw-schema' },
        { text: 'RawSchemaProperty', link: '/api/types/raw-schema-property' },
        { text: 'Constructor', link: '/api/types/constructor' },
        { text: 'ConstructorReturn', link: '/api/types/constructor-return' },
        { text: 'ArrayConstructor', link: '/api/types/array-constructor' },
        {
          text: 'AsyncFunctionConstructor',
          link: '/api/types/async-function-constructor',
        },
        {
          text: 'GeneratorFunctionConstructor',
          link: '/api/types/generator-function-constructor',
        },
        { text: 'PropertyKey', link: '/api/types/property-key' },
        { text: 'PropertySchema', link: '/api/types/property-schema' },
        { text: 'PropertySchemaRaw', link: '/api/types/property-schema-raw' },
        {
          text: 'PropertySchemaReturn',
          link: '/api/types/property-schema-return',
        },
        {
          text: 'ObjectError',
          link: '/api/types/object-error',
        },
        {
          text: 'PropertyError',
          link: '/api/types/property-error',
        },
        {
          text: 'GeneralError',
          link: '/api/types/general-error',
        },
      ],
    },
  ],
}

export default defineConfig({
  base: 'dtavern-object-parser',
  lang: 'en-US',
  title: 'ObjectParser',
  description: 'A light-weight object parser',

  lastUpdated: true,
  cleanUrls: 'without-subfolders',

  head: [
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/.vitepress/assets/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/.vitepress/assets/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/.vitepress/assets/favicon-16x16.png',
      },
    ],
    ['link', { rel: 'manifest', href: '/.vitepress/assets/site.webmanifest' }],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/.vitepress/assets/safari-pinned-tab.svg',
        color: '#4B91F1',
      },
    ],
    ['link', { rel: 'shortcut icon', href: '/.vitepress/assets/favicon.ico' }],
    ['meta', { name: 'msapplication-TileColor', content: '#4B91F1' }],
    [
      'meta',
      {
        name: 'msapplication-config',
        content: '/.vitepress/assets/browserconfig.xml',
      },
    ],
    ['meta', { name: 'theme-color', content: '#4B91F1' }],
  ],

  markdown: {
    headers: {
      level: [0, 0],
    },
  },

  themeConfig: {
    sidebar,

    nav,

    logo: '/.vitepress/assets/android-chrome-192x192.png',

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/dmitrytavern/dtavern-object-parser',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Dmitry Tavern',
    },
  },
})
