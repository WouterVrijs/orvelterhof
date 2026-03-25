import { type SchemaTypeDefinition } from 'sanity'

// Documents
import page from './documents/page'
import groepsgroottePage from './documents/groepsgroottePage'
import blog from './documents/blog'
import blogCategory from './documents/blogCategory'
import voorziening from './documents/voorziening'
import testimonial from './documents/testimonial'
import faq from './documents/faq'
import siteSettings from './documents/siteSettings'

// Objects
import seo from './objects/seo'
import heroSection from './objects/heroSection'
import contentBlock from './objects/contentBlock'
import cta from './objects/cta'
import openingHours from './objects/openingHours'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  page,
  groepsgroottePage,
  blog,
  blogCategory,
  voorziening,
  testimonial,
  faq,
  siteSettings,
  // Objects
  seo,
  heroSection,
  contentBlock,
  cta,
  openingHours,
]
