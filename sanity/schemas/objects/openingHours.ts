import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'openingHours',
  title: 'Openingstijden',
  type: 'object',
  fields: [
    defineField({
      name: 'dagen',
      title: 'Dagen',
      type: 'string',
      placeholder: 'Maandag - Vrijdag',
    }),
    defineField({
      name: 'tijden',
      title: 'Tijden',
      type: 'string',
      placeholder: '09:00 - 17:00',
    }),
    defineField({
      name: 'opmerking',
      title: 'Opmerking',
      type: 'string',
      placeholder: 'Op afspraak',
    }),
  ],
  preview: {
    select: { dagen: 'dagen', tijden: 'tijden' },
    prepare({ dagen, tijden }) {
      return { title: dagen, subtitle: tijden }
    },
  },
})
