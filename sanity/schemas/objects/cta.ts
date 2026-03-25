import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'cta',
  title: 'Call-to-action',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Button tekst',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'URL',
      type: 'string',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primair', value: 'primary' },
          { title: 'Secundair', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'isExternal',
      title: 'Open in nieuw tabblad',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
