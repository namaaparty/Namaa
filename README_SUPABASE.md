# Supabase Integration Guide

## Setup Complete! ✅

Your Namaa Party website is now fully integrated with Supabase for data management.

## What's Connected

- ✅ News Articles (`news_articles` table)
- ✅ Statements (`statements` table)
- ✅ Page Content (`page_content` table)
- ✅ Page Sections (`page_sections` table)
- ✅ Leaders (`leaders` table)

## Tables Created

All tables have been created with Row Level Security (RLS) enabled:

### news_articles
- Stores party news and announcements
- Public read access, authenticated write access

### statements
- Stores official party statements
- Public read access, authenticated write access

### page_content
- Stores page metadata (title, hero image, etc.)
- Linked to page_sections for content

### page_sections
- Stores sections of content for each page
- Ordered by `order_number`

### leaders
- Stores party leadership information
- Includes main leaders and assistants

## Initial Data

The database has been seeded with:
- 2 initial news articles
- 2 initial statements  
- 5 initial leaders
- Default page structure for home, vision, activities, and leadership pages

## How It Works

### Client-Side Usage

The app uses `@supabase/ssr` for proper server-side rendering support:

\`\`\`typescript
import { supabase } from './lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('news_articles')
  .select('*')
  .order('date', { ascending: false })
\`\`\`

### Fallback Mechanism

All storage files have built-in fallbacks:
- If Supabase connection fails, initial data is returned
- No data loss or broken pages
- Automatic retry on next page load

## Admin Features

The admin panel (`/admin/pages`) allows you to:
- ✅ Add/Edit/Delete news articles
- ✅ Add/Edit/Delete statements
- ✅ Edit page content and sections
- ✅ Manage party leaders

All changes are automatically saved to Supabase.

## Environment Variables

Required variables (already set):
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://gavnfdnutmczdtcemzhj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
\`\`\`

## Row Level Security (RLS)

All tables have RLS policies:
- **SELECT**: Public access (anyone can read)
- **INSERT/UPDATE/DELETE**: Requires authentication

This ensures data security while allowing public viewing.

## Next Steps

1. ✅ Database tables created
2. ✅ Initial data seeded
3. ✅ RLS policies configured
4. ✅ Client-side code updated
5. ✅ Admin panel connected

You're all set! The website now uses Supabase for all data storage.

## Troubleshooting

If you see errors:
1. Check that environment variables are set correctly
2. Verify Supabase project is active
3. Check browser console for detailed error messages
4. Fallback data will be used automatically if connection fails

## Support

For Supabase-specific issues, check:
- Supabase Dashboard: https://app.supabase.com
- Project logs for detailed error information
- RLS policies if data isn't appearing correctly
