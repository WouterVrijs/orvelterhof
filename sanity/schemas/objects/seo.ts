import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'SEO titel',
      type: 'string',
      description: 'Wordt getoond in Google zoekresultaten (max 60 tekens)',
      validation: (rule) =>
        rule
          .max(60)
          .warning('Houd de titel onder de 60 tekens voor optimale weergave in Google')
          .custom((value) => {
            if (value && value.length < 30) {
              return { message: 'Probeer minstens 30 tekens te gebruiken', level: 'warning' } as const
            }
            return true
          }),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta beschrijving',
      type: 'text',
      rows: 3,
      description: 'Samenvatting voor zoekmachines (120-160 tekens)',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          if (value.length < 120) {
            return { message: 'Probeer minstens 120 tekens te gebruiken', level: 'warning' } as const
          }
          if (value.length > 160) {
            return { message: 'Houd de beschrijving onder 160 tekens', level: 'warning' } as const
          }
          return true
        }),
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus keyword',
      type: 'string',
      description: 'Het hoofdzoekwoord waar deze pagina op moet ranken',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social media afbeelding',
      type: 'image',
      description: 'Wordt getoond bij delen op social media (1200x630px)',
    }),
    defineField({
      name: 'noIndex',
      title: 'Verberg voor zoekmachines',
      type: 'boolean',
      description: 'Zet aan om deze pagina uit Google te houden',
      initialValue: false,
    }),
  ],
})
