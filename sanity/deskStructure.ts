import type { StructureBuilder } from 'sanity/structure'
import { CogIcon, DocumentIcon, UsersIcon, EditIcon, StarIcon, HelpCircleIcon, TagIcon } from '@sanity/icons'

export default (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // 1. Site instellingen (singleton)
      S.listItem()
        .title('Site instellingen')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site instellingen'),
        ),

      S.divider(),

      // 2. Pagina's
      S.listItem()
        .title("Pagina's")
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('page').title("Pagina's"),
        ),

      // 3. Groepsgrootte pagina's
      S.listItem()
        .title("Groepsgrootte pagina's")
        .icon(UsersIcon)
        .child(
          S.documentTypeList('groepsgroottePage')
            .title("Groepsgrootte pagina's")
            .defaultOrdering([{ field: 'aantalPersonen', direction: 'asc' }]),
        ),

      S.divider(),

      // 4. Blog
      S.listItem()
        .title('Blog')
        .icon(EditIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Alle posts')
                .icon(EditIcon)
                .child(
                  S.documentTypeList('blog')
                    .title('Blogposts')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Categorieën')
                .child(
                  S.documentTypeList('blogCategory').title('Categorieën'),
                ),
            ]),
        ),

      S.divider(),

      // 5. Gastervaringen
      S.listItem()
        .title('Gastervaringen')
        .icon(StarIcon)
        .child(
          S.documentTypeList('testimonial').title('Gastervaringen'),
        ),

      // 6. FAQ
      S.listItem()
        .title('FAQ')
        .icon(HelpCircleIcon)
        .child(
          S.documentTypeList('faq')
            .title('Veelgestelde vragen')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),

      // 7. Voorzieningen
      S.listItem()
        .title('Voorzieningen')
        .icon(TagIcon)
        .child(
          S.documentTypeList('voorziening').title('Voorzieningen'),
        ),
    ])
