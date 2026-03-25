import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero sectie',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Hoofdtitel',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Ondertitel',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Afbeelding',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
          validation: (rule) => rule.required().error('Alt tekst is verplicht voor toegankelijkheid'),
        }),
      ],
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA button tekst',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA button link',
      type: 'string',
    }),
    defineField({
      name: 'overlay',
      title: 'Donkere overlay',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
