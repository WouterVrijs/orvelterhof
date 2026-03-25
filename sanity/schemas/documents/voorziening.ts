import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'voorziening',
  title: 'Voorziening',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'icon',
      title: 'Icoon',
      type: 'image',
      description: 'Klein icoon/afbeelding voor de voorziening',
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'icon' },
  },
})
