import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Paginatitel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'Het pad in de URL, bijv. /accommodatie',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero sectie',
      type: 'heroSection',
    }),
    defineField({
      name: 'content',
      title: 'Pagina-inhoud',
      type: 'contentBlock',
    }),
    defineField({
      name: 'seo',
      title: 'SEO instellingen',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'order',
      title: 'Volgorde',
      type: 'number',
      hidden: true,
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO', default: false },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'hero.image',
    },
  },
})
