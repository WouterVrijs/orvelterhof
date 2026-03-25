import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'contentBlock',
  title: 'Pagina-inhoud',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normaal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Vet', value: 'strong' },
          { title: 'Cursief', value: 'em' },
          { title: 'Onderstreept', value: 'underline' },
          { title: 'Doorgestreept', value: 'strike-through' },
        ],
        annotations: [
          {
            name: 'internalLink',
            title: 'Interne link',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                title: 'Pagina',
                type: 'reference',
                to: [{ type: 'page' }, { type: 'groepsgroottePage' }, { type: 'blog' }],
              }),
            ],
          },
          {
            name: 'externalLink',
            title: 'Externe link',
            type: 'object',
            fields: [
              defineField({
                name: 'url',
                title: 'URL',
                type: 'url',
                validation: (rule) => rule.required(),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in nieuw tabblad',
                type: 'boolean',
                initialValue: true,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Bijschrift',
          type: 'string',
        }),
        defineField({
          name: 'alignment',
          title: 'Uitlijning',
          type: 'string',
          options: {
            list: [
              { title: 'Links', value: 'left' },
              { title: 'Midden', value: 'center' },
              { title: 'Rechts', value: 'right' },
              { title: 'Volledig', value: 'full' },
            ],
          },
          initialValue: 'center',
        }),
      ],
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Callout',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Tip', value: 'tip' },
              { title: 'Info', value: 'info' },
              { title: 'Waarschuwing', value: 'warning' },
            ],
          },
          initialValue: 'info',
        }),
        defineField({
          name: 'text',
          title: 'Tekst',
          type: 'text',
          rows: 3,
        }),
      ],
      preview: {
        select: { type: 'type', text: 'text' },
        prepare({ type, text }) {
          const icons: Record<string, string> = { tip: '💡', info: 'ℹ️', warning: '⚠️' }
          return {
            title: `${icons[type] || ''} ${type?.charAt(0).toUpperCase()}${type?.slice(1) || 'Callout'}`,
            subtitle: text?.slice(0, 60),
          }
        },
      },
    }),
    defineArrayMember({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Tekst',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'link',
          title: 'Link',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'variant',
          title: 'Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Primair', value: 'primary' },
              { title: 'Secundair', value: 'secondary' },
            ],
          },
          initialValue: 'primary',
        }),
      ],
      preview: {
        select: { text: 'text', link: 'link' },
        prepare({ text, link }) {
          return { title: `🔘 ${text}`, subtitle: link }
        },
      },
    }),
  ],
})
