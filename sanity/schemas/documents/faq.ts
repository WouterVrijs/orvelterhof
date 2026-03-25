import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'Veelgestelde vraag',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Vraag',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Antwoord',
      type: 'contentBlock',
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: ['Algemeen', 'Boeken', 'Faciliteiten', 'Omgeving', 'Prijzen'],
      },
    }),
    defineField({
      name: 'order',
      title: 'Volgorde',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
})
