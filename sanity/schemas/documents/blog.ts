import { defineType, defineField } from 'sanity'
import { EditIcon } from '@sanity/icons'

export default defineType({
  name: 'blog',
  title: 'Blogpost',
  type: 'document',
  icon: EditIcon,
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hoofdafbeelding',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
          validation: (rule) => rule.required().error('Alt tekst is verplicht'),
        }),
        defineField({
          name: 'caption',
          title: 'Bijschrift',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'datetime',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
    }),
    defineField({
      name: 'excerpt',
      title: 'Samenvatting',
      type: 'text',
      rows: 3,
      description: 'Korte beschrijving voor de blog overzichtspagina (max 200 tekens)',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'content',
      title: 'Inhoud',
      type: 'contentBlock',
    }),
    defineField({
      name: 'relatedPages',
      title: 'Gerelateerde pagina\'s',
      type: 'array',
      description: "Interne links voor SEO (toon als 'Lees ook' sectie)",
      of: [
        { type: 'reference', to: [{ type: 'page' }, { type: 'groepsgroottePage' }, { type: 'blog' }] },
      ],
      validation: (rule) => rule.max(4),
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
  orderings: [
    {
      title: 'Publicatiedatum (nieuwste eerst)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      date: 'publishedAt',
      media: 'mainImage',
    },
    prepare({ title, category, date, media }) {
      const formattedDate = date ? new Date(date).toLocaleDateString('nl-NL') : ''
      return {
        title,
        subtitle: [category, formattedDate].filter(Boolean).join(' | '),
        media,
      }
    },
  },
})
