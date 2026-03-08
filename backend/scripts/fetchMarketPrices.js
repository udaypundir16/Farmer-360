const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cron = require('node-cron');
const { supabase } = require('../src/config/database');
const axios = require('axios');


async function fetchMarketPrices() {
  try {
    console.log('[Market Prices] Fetching real-time prices from government API with pagination...');

    const MAX_RETRIES = 3;
    let allRecords = [];
    let offset = 0;
    const LIMIT = 100;
    let hasMore = true;

    // Fetch all records with pagination
    while (hasMore) {
      let retries = 0;
      let response;

      while (retries < MAX_RETRIES) {
        try {
          const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=${LIMIT}&offset=${offset}`;
          response = await axios.get(url, {
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          break; // Success
        } catch (err) {
          if (err.response && err.response.status === 429) {
            retries++;
            const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.warn(`[Market Prices] Rate limited (429). Retrying in ${waitTime}ms... (Attempt ${retries}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else {
            console.warn(`[Market Prices] Error fetching offset ${offset}:`, err.message);
            hasMore = false;
            break;
          }
        }
      }

      if (!response) break;

      const pageRecords = response.data.records || [];
      if (!pageRecords.length) {
        hasMore = false;
        break;
      }

      allRecords = allRecords.concat(pageRecords);
      offset += LIMIT;
      console.log(`[Market Prices] Fetched ${allRecords.length} records so far...`);
    }

    const records = allRecords;

    if (!records.length) {
      console.log('[Market Prices] No prices received from API');
      return;
    }

    console.log(`[Market Prices] Received ${records.length} total records from API`);

    // Delete old prices to keep data fresh (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleteResult = await supabase
      .from('market_prices')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());

    console.log(`[Market Prices] Cleaned old records`);

    // Insert new prices
    let inserted = 0;
    let failed = 0;

    for (const record of records) {
      try {
        // Convert DD/MM/YYYY format to YYYY-MM-DD
        let formattedDate = new Date().toISOString().split('T')[0];
        if (record.arrival_date) {
          const dateParts = record.arrival_date.split('/');
          if (dateParts.length === 3) {
            formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
        }

        const priceRecord = {
          commodity: record.commodity || 'Unknown',
          market: record.market || 'Unknown',
          state: record.state || 'Unknown',
          min_price: Number(record.min_price) || 0,
          max_price: Number(record.max_price) || 0,
          modal_price: Number(record.modal_price) || 0,
          price_date: formattedDate,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('market_prices')
          .insert([priceRecord]);

        if (error) {
          if (error.message && error.message.includes('duplicate')) {
            // Duplicate is okay, just skip
          } else {
            console.error(`[Market Prices] Error inserting ${record.commodity}:`, error.message);
            failed++;
          }
        } else {
          inserted++;
        }
      } catch (err) {
        console.error(`[Market Prices] Exception processing record:`, err.message);
        failed++;
      }
    }

    console.log(`[Market Prices] ✓ Inserted ${inserted} prices, Failed: ${failed} at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('[Market Prices] Fatal Error Type:', error.code || 'Unknown');
    console.error('[Market Prices] Fatal Error Message:', error.message);
    if (error.response) {
      console.error('[Market Prices] API Status:', error.response.status);
      console.error('[Market Prices] API Headers:', error.response.headers);
    }
  }
}

const startMarketPriceService = () => {
  // Fetch immediately on startup
  console.log('[Market Prices] Starting market price service...');
  fetchMarketPrices();

  // Schedule to run every 30 minutes (*/30 * * * *)
  cron.schedule('*/30 * * * *', () => {
    console.log('[Market Prices] Cron job triggered...');
    fetchMarketPrices();
  });

  console.log('[Market Prices] ✓ Cron job scheduled to run every 30 minutes');
};

// If run directly via node, start the service
if (require.main === module) {
  startMarketPriceService();
}

module.exports = { fetchMarketPrices, startMarketPriceService };