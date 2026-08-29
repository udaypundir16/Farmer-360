const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cron = require('node-cron');
const { supabase } = require('../src/config/database');
const axios = require('axios');


async function fetchMarketPrices(maxRecords = 200) {
  try {
    console.log('[Market Prices] Fetching real-time prices from government API...');

    let allRecords = [];
    let offset = 0;
    const LIMIT = 10;
    const targetCount = maxRecords;

    const apiKey = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

    while (allRecords.length < targetCount) {
      let attempts = 0;
      let success = false;

      while (attempts < 4 && !success) {
        try {
          const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=${LIMIT}&offset=${offset}`;
          const response = await axios.get(url, {
            timeout: 12000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const pageRecords = response.data.records || [];
          if (!pageRecords.length) {
            allRecords = allRecords.concat([]);
            success = true;
            break;
          }

          allRecords = allRecords.concat(pageRecords);
          offset += LIMIT;
          success = true;

          // Delay between requests
          await new Promise(r => setTimeout(r, 400));
        } catch (err) {
          attempts++;
          if (err.response && err.response.status === 429) {
            const waitMs = attempts * 1500;
            console.log(`[Market Prices] Rate limit hit. Waiting ${waitMs}ms before retry...`);
            await new Promise(r => setTimeout(r, waitMs));
          } else {
            console.warn(`[Market Prices] Fetch warning at offset ${offset}:`, err.message);
            break;
          }
        }
      }

      if (!success) break;
    }

    if (!allRecords.length) {
      console.log('[Market Prices] No records fetched.');
      return;
    }

    console.log(`[Market Prices] Fetched ${allRecords.length} fresh records from API`);

    // Prepare batch
    const formattedRecords = allRecords.map((record) => {
      let formattedDate = new Date().toISOString().split('T')[0];
      if (record.arrival_date) {
        const dateParts = record.arrival_date.split('/');
        if (dateParts.length === 3) {
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }
      }

      return {
        commodity: record.commodity || 'Unknown',
        market: record.market || 'Unknown',
        state: record.state || 'Unknown',
        min_price: Number(record.min_price) || 0,
        max_price: Number(record.max_price) || 0,
        modal_price: Number(record.modal_price) || 0,
        price_date: formattedDate,
        created_at: new Date().toISOString(),
      };
    });

    // Delete old records older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await supabase.from('market_prices').delete().lt('created_at', thirtyDaysAgo.toISOString());

    // Batch insert in chunks of 50
    let inserted = 0;
    const chunkSize = 50;
    for (let i = 0; i < formattedRecords.length; i += chunkSize) {
      const chunk = formattedRecords.slice(i, i + chunkSize);
      const { data, error } = await supabase.from('market_prices').insert(chunk);
      if (!error) {
        inserted += chunk.length;
      } else {
        console.error('[Market Prices] Batch insert error:', error.message);
      }
    }

    console.log(`[Market Prices] ✓ Successfully updated ${inserted} market price records with latest dates.`);
  } catch (error) {
    console.error('[Market Prices] Error fetching/updating prices:', error.message);
  }
}

const startMarketPriceService = () => {
  console.log('[Market Prices] Starting automated market price service...');
  fetchMarketPrices(150);

  // Schedule to run every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    console.log('[Market Prices] Scheduled refresh triggered...');
    fetchMarketPrices(150);
  });
};

if (require.main === module) {
  startMarketPriceService();
}

module.exports = { fetchMarketPrices, startMarketPriceService };