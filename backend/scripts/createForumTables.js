require('dotenv').config();
const { supabase } = require('../src/config/database');



/**
 * Create forum tables in Supabase.
 * 
 * Run this script ONCE to set up the tables:
 *   node scripts/createForumTables.js
 * 
 * NOTE: If you cannot run raw SQL via the JS client, create these tables
 * manually in the Supabase Dashboard → SQL Editor:
 * 
 * CREATE TABLE IF NOT EXISTS forum_posts (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   description TEXT NOT NULL,
 *   crop_tag TEXT NOT NULL,
 *   author_id TEXT DEFAULT 'anonymous',
 *   author_name TEXT DEFAULT 'Anonymous Farmer',
 *   likes INTEGER DEFAULT 0,
 *   liked_by TEXT[] DEFAULT '{}',
 *   view_count INTEGER DEFAULT 0,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE IF NOT EXISTS forum_replies (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
 *   author_id TEXT DEFAULT 'anonymous',
 *   author_name TEXT DEFAULT 'Anonymous Farmer',
 *   content TEXT NOT NULL,
 *   likes INTEGER DEFAULT 0,
 *   liked_by TEXT[] DEFAULT '{}',
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

async function createTables() {
    console.log('Attempting to create forum tables...\n');

    // Try using Supabase rpc or direct SQL
    const { error: postsError } = await supabase.rpc('exec_sql', {
        query: `
      CREATE TABLE IF NOT EXISTS forum_posts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        crop_tag TEXT NOT NULL,
        author_id TEXT DEFAULT 'anonymous',
        author_name TEXT DEFAULT 'Anonymous Farmer',
        likes INTEGER DEFAULT 0,
        liked_by TEXT[] DEFAULT '{}',
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    });

    if (postsError) {
        console.log('Could not run SQL via rpc. This is expected if exec_sql function is not set up.');
        console.log('Error:', postsError.message);
        console.log('\n--- MANUAL SETUP REQUIRED ---');
        console.log('Please run the following SQL in Supabase Dashboard → SQL Editor:\n');
        console.log(`
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  crop_tag TEXT NOT NULL,
  author_id TEXT DEFAULT 'anonymous',
  author_name TEXT DEFAULT 'Anonymous Farmer',
  likes INTEGER DEFAULT 0,
  liked_by TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id TEXT DEFAULT 'anonymous',
  author_name TEXT DEFAULT 'Anonymous Farmer',
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  liked_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security but allow all operations for now
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on forum_posts" ON forum_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on forum_replies" ON forum_replies FOR ALL USING (true) WITH CHECK (true);
    `);
    } else {
        console.log('✓ forum_posts table created');

        const { error: repliesError } = await supabase.rpc('exec_sql', {
            query: `
        CREATE TABLE IF NOT EXISTS forum_replies (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
          author_id TEXT DEFAULT 'anonymous',
          author_name TEXT DEFAULT 'Anonymous Farmer',
          content TEXT NOT NULL,
          likes INTEGER DEFAULT 0,
          liked_by TEXT[] DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        });

        if (repliesError) {
            console.log('✗ Error creating forum_replies:', repliesError.message);
        } else {
            console.log('✓ forum_replies table created');
        }
    }

    // Test if tables exist by trying to query them
    console.log('\nVerifying tables...');
    const { error: testPosts } = await supabase.from('forum_posts').select('id').limit(0);
    const { error: testReplies } = await supabase.from('forum_replies').select('id').limit(0);

    console.log('forum_posts:', testPosts ? `✗ ${testPosts.message}` : '✓ accessible');
    console.log('forum_replies:', testReplies ? `✗ ${testReplies.message}` : '✓ accessible');

    process.exit(0);
}

createTables();
