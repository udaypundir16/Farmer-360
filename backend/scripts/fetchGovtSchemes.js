require('dotenv').config();
const { supabase } = require('../src/config/database');
const Parser = require('rss-parser');
const parser = new Parser();

// Fetch government schemes from Google News RSS
// Run with:  node scripts/fetchGovtSchemes.js
//
// Fetches real news about government agriculture schemes from Google News

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha',
  'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

async function fetchSchemesFromNews() {
  try {
    console.log('[Govt Schemes] Fetching government schemes from Google News RSS...');
    
    const feed = await parser.parseURL(
      'https://news.google.com/rss/search?q=agriculture+schemes+india+government&hl=en-IN&gl=IN&ceid=IN:en'
    );

    console.log(`[Govt Schemes] Received ${feed.items.length} news items`);

    const newsSchemes = (feed.items || []).slice(0, 25).map((item) => {
      const title = item.title || 'Unknown Scheme';
      const description = item.contentSnippet || item.description || '';
      const text = (title + ' ' + description).toLowerCase();

      // Categorize intelligently
      let category = 'other';
      if (text.includes('subsidy') || text.includes('grant') || text.includes('pm-kisan') || text.includes('fund') || text.includes('crore') || text.includes('incentive') || text.includes('yojana') || text.includes('outlay')) {
        category = 'subsidy';
      } else if (text.includes('insurance') || text.includes('bima') || text.includes('claim') || text.includes('relief') || text.includes('loss') || text.includes('compensation')) {
        category = 'insurance';
      } else if (text.includes('loan') || text.includes('credit') || text.includes('kcc') || text.includes('finance') || text.includes('bank') || text.includes('interest')) {
        category = 'loan';
      } else if (text.includes('training') || text.includes('mission') || text.includes('digital') || text.includes('tech') || text.includes('ai') || text.includes('drone') || text.includes('skill') || text.includes('education')) {
        category = 'training';
      }

      // State recognition
      let detectedState = 'All India';
      for (const st of INDIAN_STATES) {
        if (new RegExp(`\\b${st}\\b`, 'i').test(title + ' ' + description)) {
          detectedState = st;
          break;
        }
      }

      return {
        name: title.substring(0, 200),
        description: description.substring(0, 500) || title,
        category: category,
        state_specific: detectedState,
        news_link: item.link,
        source: item.source || 'Google News'
      };
    });

    // Core flagship government schemes to ensure full coverage across all categories & states
    const coreFlagshipSchemes = [
      {
        name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        description: "Direct income support of ₹6,000 per year in 3 equal installments to all landholding farmer families across India.",
        category: "subsidy",
        state_specific: "All India",
        news_link: "https://pmkisan.gov.in/",
        source: "Ministry of Agriculture"
      },
      {
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest.",
        category: "insurance",
        state_specific: "All India",
        news_link: "https://pmfby.gov.in/",
        source: "Ministry of Agriculture"
      },
      {
        name: "Kisan Credit Card (KCC) Scheme",
        description: "Concessional institutional credit up to ₹3 Lakh at an effective interest rate of 4% per annum.",
        category: "loan",
        state_specific: "All India",
        news_link: "https://www.myscheme.gov.in/schemes/kcc",
        source: "NABARD & RBI"
      },
      {
        name: "Sub-Mission on Agricultural Mechanization (SMAM)",
        description: "Financial assistance and up to 50% subsidy on purchase of modern agricultural machinery and tractors.",
        category: "subsidy",
        state_specific: "Punjab",
        news_link: "https://agrimachinery.nic.in/",
        source: "Ministry of Agriculture"
      },
      {
        name: "Digital Agriculture Mission & Drone Subsidy",
        description: "Financial assistance and training for farmers and FPOs to adopt agricultural drones and AI sensor technology.",
        category: "training",
        state_specific: "Haryana",
        news_link: "https://pib.gov.in/",
        source: "PIB"
      },
      {
        name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
        description: "Micro irrigation subsidy ('Per Drop More Crop') providing up to 55% financial assistance for drip and sprinkler irrigation.",
        category: "subsidy",
        state_specific: "Maharashtra",
        news_link: "https://pmksy.gov.in/",
        source: "Ministry of Jal Shakti & Agriculture"
      },
      {
        name: "Paramparagat Krishi Vikas Yojana (PKVY)",
        description: "Financial support of ₹50,000 per hectare for cluster formation, capacity building, and organic farm certification.",
        category: "training",
        state_specific: "Uttar Pradesh",
        news_link: "https://daccrow.gov.in/",
        source: "Ministry of Agriculture"
      },
      {
        name: "Agriculture Infrastructure Fund (AIF)",
        description: "Medium-long term debt financing facility with 3% interest subvention for post-harvest management projects and cold storages.",
        category: "loan",
        state_specific: "Tamil Nadu",
        news_link: "https://agriinfra.dac.gov.in/",
        source: "Ministry of Agriculture"
      },
      {
        name: "Restructured Weather Based Crop Insurance Scheme (RWBCIS)",
        description: "Insurance protection to farmers against adverse weather conditions like excess rainfall, heatwaves, and frost.",
        category: "insurance",
        state_specific: "Rajasthan",
        news_link: "https://pmfby.gov.in/",
        source: "Government of India"
      }
    ];

    return [...coreFlagshipSchemes, ...newsSchemes];
  } catch (error) {
    console.error('[Govt Schemes] Error fetching from Google News:', error.message);
    return [];
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
