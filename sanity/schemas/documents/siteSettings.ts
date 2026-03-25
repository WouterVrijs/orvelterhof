import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site instellingen',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Sitenaam',
      type: 'string',
      initialValue: 'Groepsaccommodatie Orvelter Hof',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Website URL',
      type: 'url',
      initialValue: 'https://groepsaccommodatieorvelterhof.nl',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contactgegevens',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          title: 'Telefoonnummer',
          type: 'string',
          initialValue: '06-11 78 49 75',
        }),
        defineField({
          name: 'email',
          title: 'E-mailadres',
          type: 'string',
          initialValue: 'info@orvelterhof.nl',
        }),
        defineField({
          name: 'address',
          title: 'Adres',
          type: 'text',
          rows: 2,
          initialValue: 'Mr. J.B. Kanweg 7a, 9439 TD Witteveen',
        }),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Openingstijden',
      type: 'array',
      of: [{ type: 'openingHours' }],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Standaard SEO instellingen',
      type: 'seo',
      description: 'Wordt gebruikt als fallback wanneer een pagina geen eigen SEO heeft',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social media',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube'],
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Boekings URL',
      type: 'url',
      description: 'Link naar het boekingssysteem',
    }),
    defineField({
      name: 'googleMapsEmbed',
      title: 'Google Maps embed code',
      type: 'text',
    }),
  ],
})
