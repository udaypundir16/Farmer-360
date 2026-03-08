require('dotenv').config();
const { supabase } = require('../src/config/database');
const Parser = require('rss-parser');
const parser = new Parser();

// Fetch government schemes from Google News RSS
// Run with:  node scripts/fetchGovtSchemes.js
//
// Fetches real news about government agriculture schemes from Google News

async function fetchSchemesFromNews() {
  try {
    console.log('[Govt Schemes] Fetching government schemes from Google News RSS...');
    
    const feed = await parser.parseURL(
      'https://news.google.com/rss/search?q=agriculture+schemes+india+government&hl=en-IN&gl=IN&ceid=IN:en'
    );

    console.log(`[Govt Schemes] Received ${feed.items.length} news items`);

    const schemes = feed.items.slice(0, 20).map((item, index) => {
      // Extract scheme info from news title and content
      const title = item.title || 'Unknown Scheme';
      const description = item.contentSnippet || item.description || '';
      
      // Categorize based on keywords in title/description
      let category = 'other';
      const content = (title + ' ' + description).toLowerCase();
      
      if (content.includes('subsidy') || content.includes('grant')) category = 'subsidy';
      else if (content.includes('insurance') || content.includes('bima')) category = 'insurance';
      else if (content.includes('loan') || content.includes('credit') || content.includes('kcc')) category = 'loan';
      else if (content.includes('pension') || content.includes('maandhan')) category = 'other';

      return {
        name: title.substring(0, 200),
        description: description.substring(0, 500),
        category: category,
        state_specific: 'All India',
        news_link: item.link,
        source: item.source || 'Google News'
      };
    });

    return schemes;
  } catch (error) {
    console.error('[Govt Schemes] Error fetching from Google News:', error.message);
    console.log('[Govt Schemes] Falling back to default schemes...');
    
    // Fallback schemes if API fails
    return [
      {
        name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        description: "Direct income support scheme providing Rs.6,000 per year to all landholding farmer families.",
        category: "subsidy",
        state_specific: "All India"
      },
      {
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "Comprehensive crop insurance scheme for farmers suffering crop loss.",
        category: "insurance",
        state_specific: "All India"
      },
      {
        name: "Kisan Credit Card (KCC)",
        description: "Provides affordable short-term credit for cultivation and farm needs.",
        category: "loan",
        state_specific: "All India"
      }
    ];
  }
}

async function seedSchemes() {
  console.log('[Govt Schemes] Starting government schemes sync...');
  
  // Fetch real schemes from Google News
  const SCHEMES = await fetchSchemesFromNews();
  
  console.log(`[Govt Schemes] Syncing ${SCHEMES.length} schemes to database...`);

  // Clean up any test data first
  await supabase.from('schemes').delete().eq('name', 'ColTest');
  await supabase.from('schemes').delete().eq('name', 'X');

  for (const scheme of SCHEMES) {
    // Check if already exists by name
    const { data: existing } = await supabase
      .from('schemes')
      .select('id')
      .eq('name', scheme.name)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing
      const { error } = await supabase
        .from('schemes')
        .update(scheme)
        .eq('id', existing[0].id);

      if (error) {
        console.error(`✗ Failed to update "${scheme.name}":`, error.message);
      } else {
        console.log(`↻ Updated: ${scheme.name}`);
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('schemes')
        .insert(scheme);

      if (error) {
        console.error(`✗ Failed to insert "${scheme.name}":`, error.message);
      } else {
        console.log(`✓ Inserted: ${scheme.name}`);
      }
    }
  }

  console.log('\nDone! Seeding complete.');
  process.exit(0);
}

seedSchemes();
