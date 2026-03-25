import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'groepsgroottePage',
  title: 'Groepsgrootte pagina',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Paginatitel',
      type: 'string',
      placeholder: 'Groepsaccommodatie Drenthe 20 personen',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aantalPersonen',
      title: 'Aantal personen',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'hero',
      title: 'Hero sectie',
      type: 'heroSection',
    }),
    defineField({
      name: 'introText',
      title: 'Introductie tekst',
      type: 'text',
      rows: 4,
      description: 'Korte samenvatting bovenaan de pagina',
    }),
    defineField({
      name: 'content',
      title: 'Pagina-inhoud',
      type: 'contentBlock',
    }),
    defineField({
      name: 'kamerindeling',
      title: 'Kamerindeling',
      type: 'contentBlock',
      description: 'Beschrijving van de kamerindeling voor dit aantal gasten',
    }),
    defineField({
      name: 'voorzieningen',
      title: 'Voorzieningen',
      type: 'array',
      description: 'Selecteer de beschikbare voorzieningen',
      of: [{ type: 'reference', to: [{ type: 'voorziening' }] }],
    }),
    defineField({
      name: 'prijsIndicatie',
      title: 'Prijsindicatie',
      type: 'string',
      description: "Bijv. 'Vanaf €25 per persoon per nacht'",
    }),
    defineField({
      name: 'seo',
      title: 'SEO instellingen',
      type: 'seo',
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO', default: false },
  ],
  preview: {
    select: {
      title: 'title',
      personen: 'aantalPersonen',
      media: 'hero.image',
    },
    prepare({ title, personen, media }) {
      return {
        title,
        subtitle: personen ? `${personen} personen` : '',
        media,
      }
    },
  },
})
