/**
 * SQL barrel export.
 *
 * This module groups all raw SQL query strings for the API.
 *
 * Conventions:
 * - Raw SQL only (no ORM).
 * - Always use parameter placeholders (`$1..$n`) and pass values separately.
 * - Keep complex query logic documented close to the query.
 *
 * Usage:
 * - Repositories should import from the specific module (preferred), e.g.
 *   `import * as ServicesSQL from '../sql/public/services'`
 * - Or import via this barrel for grouping, e.g.
 *   `import { ServicesSQL } from '../sql'`
 */

// Barrel export for all SQL queries

// Public
export * as ServicesSQL from './public/services';
export * as PostsSQL from './public/posts';
export * as SidebarSQL from './public/sidebar';
export * as SiteSQL from './public/site';

// Admin
export * as AdminAuthSQL from './admin/auth';
export * as AdminServicesSQL from './admin/services';
export * as AdminServicesCrudSQL from './admin/servicesCrud';
export * as AdminServiceDeleteSQL from './admin/serviceDelete';
export * as AdminPostsSQL from './admin/posts';
export * as AdminPostsCrudSQL from './admin/postsCrud';
export * as AdminTaxonomySQL from './admin/taxonomy';
export * as AdminTaxonomyDeleteSQL from './admin/taxonomyDelete';
export * as AdminLeadsSQL from './admin/leads';
export * as AdminNewsletterSubscribersSQL from './admin/newsletterSubscribers';
export * as AdminNavItemsSQL from './admin/navItems';
export * as AdminSiteSettingsSQL from './admin/siteSettings';
export * as AdminPagesSQL from './admin/pages';
