import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Gastervaring',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Review tekst',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Beoordeling (1-5)',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'date',
      title: 'Datum verblijf',
      type: 'date',
    }),
    defineField({
      name: 'groupType',
      title: 'Type groep',
      type: 'string',
      options: {
        list: ['Familie', 'Vrienden', 'Bedrijf', 'Vereniging', 'Anders'],
      },
    }),
  ],
  preview: {
    select: { title: 'name', quote: 'quote' },
    prepare({ title, quote }) {
      return {
        title,
        subtitle: quote?.slice(0, 80),
      }
    },
  },
})
