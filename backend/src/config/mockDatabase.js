// In-memory mock database for development (without Supabase)
const users = new Map();
const alerts = new Map();
const schemes = new Map();
const markets = new Map();
const shipments = new Map();

let userIdCounter = 1;
let shipmentIdCounter = 1;

// Real Indian Government Schemes
const realSchemes = [
  {
    id: '1',
    name: 'PM-KISAN',
    description: 'Pradhan Mantri Kisan Samman Nidhi - Direct income support scheme providing ₹6,000 annually in three equal installments to eligible small and marginal farmer families.',
    category: 'Income Support',
    state_specific: false,
    benefits: ['₹6,000 annually', 'Direct bank transfer', 'No paperwork required'],
    eligibility: 'Small and marginal farmers with land holdings up to 2 hectares',
    website: 'https://pmkisan.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support to farmers against crop loss due to natural calamities, pests, and diseases.',
    category: 'Insurance',
    state_specific: false,
    benefits: ['Crop loss compensation', 'Affordable premiums', 'Quick claim settlement'],
    eligibility: 'All farmers growing notified crops in notified areas',
    website: 'https://pmfby.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Soil Health Card Scheme',
    description: 'Provides soil testing and recommendations for balanced use of fertilizers based on soil nutrient status to improve soil health.',
    category: 'Soil Management',
    state_specific: false,
    benefits: ['Free soil testing', 'Personalized fertilizer recommendations', 'Improved soil fertility'],
    eligibility: 'All farmers',
    website: 'https://soilhealth.dac.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana',
    description: 'Irrigation focused scheme promoting water conservation and efficient water management in agriculture with micro irrigation technologies.',
    category: 'Irrigation',
    state_specific: false,
    benefits: ['Subsidized irrigation equipment', '50% cost assistance', 'Water conservation'],
    eligibility: 'Farmers with suitable land for irrigation',
    website: 'https://pmksy.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Kisan Credit Card Scheme',
    description: 'Credit facility scheme providing short-term credit to farmers for agricultural and allied activities with minimal documentation.',
    category: 'Credit',
    state_specific: false,
    benefits: ['Easy credit access', 'Low interest rates', 'Flexible repayment'],
    eligibility: 'Farmers with valid land documents',
    website: 'https://kcc.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Paramparagat Krishi Vikas Yojana',
    description: 'Organic farming promotion scheme providing support for organic cultivation and certification through cluster-based approach.',
    category: 'Organic Farming',
    state_specific: false,
    benefits: ['Organic certification support', 'Bio-inputs subsidy', 'Market linkage'],
    eligibility: 'Farmers interested in organic farming',
    website: 'https://pkvy.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Rashtriya Gokul Mission',
    description: 'Conservation and development of Indian cow breeds with support for cattle breeding and dairy farming.',
    category: 'Cattle & Dairy',
    state_specific: false,
    benefits: ['Cattle subsidy', 'Breeding support', 'Dairy equipment assistance'],
    eligibility: 'Farmers keeping Indian cattle breeds',
    website: 'https://rgmis.nic.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'e-NAM (National Agriculture Market)',
    description: 'Electronic platform connecting farmers, traders, and consumers for transparent and efficient agricultural trade.',
    category: 'Market Access',
    state_specific: false,
    benefits: ['Direct market access', 'Better prices', 'Reduced intermediaries'],
    eligibility: 'All farmers',
    website: 'https://enam.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Pradhan Mantri Beej Gram Yojana',
    description: 'Distribution of high-quality seeds to farmers at subsidized rates to ensure improved crop productivity.',
    category: 'Seeds & Input',
    state_specific: false,
    benefits: ['Certified seeds', 'Subsidized rates', 'Improved yields'],
    eligibility: 'All farmers',
    website: 'https://pmbgy.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Atmosphere and Climate Resilient Agriculture',
    description: 'Support for climate-smart agriculture practices to build resilience against climate change impacts.',
    category: 'Climate Resilience',
    state_specific: false,
    benefits: ['Climate-smart training', 'Technology support', 'Risk mitigation'],
    eligibility: 'Farmers in vulnerable areas',
    website: 'https://acra.gov.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Real Market Prices (based on typical Indian agricultural markets)
const realMarketPrices = [
  // Wheat prices across markets
  { id: '1', commodity: 'Wheat', market: 'Delhi - Mandi', state: 'Delhi', modal_price: 2150, price_date: new Date().toISOString().split('T')[0], min_price: 2100, max_price: 2200, arrivals: 5000 },
  { id: '2', commodity: 'Wheat', market: 'Punjab - Jalandhar', state: 'Punjab', modal_price: 2180, price_date: new Date().toISOString().split('T')[0], min_price: 2150, max_price: 2210, arrivals: 8000 },
  { id: '3', commodity: 'Wheat', market: 'Haryana - Kurukshetra', state: 'Haryana', modal_price: 2165, price_date: new Date().toISOString().split('T')[0], min_price: 2140, max_price: 2190, arrivals: 6000 },
  { id: '4', commodity: 'Wheat', market: 'Uttar Pradesh - Meerut', state: 'Uttar Pradesh', modal_price: 2140, price_date: new Date().toISOString().split('T')[0], min_price: 2120, max_price: 2170, arrivals: 4500 },

  // Rice prices
  { id: '5', commodity: 'Rice (Basmati)', market: 'Punjab - Amritsar', state: 'Punjab', modal_price: 4200, price_date: new Date().toISOString().split('T')[0], min_price: 4100, max_price: 4300, arrivals: 3000 },
  { id: '6', commodity: 'Rice (Common)', market: 'Tamil Nadu - Chennai', state: 'Tamil Nadu', modal_price: 2850, price_date: new Date().toISOString().split('T')[0], min_price: 2800, max_price: 2900, arrivals: 5500 },
  { id: '7', commodity: 'Rice (Basmati)', market: 'Uttar Pradesh - Lucknow', state: 'Uttar Pradesh', modal_price: 3950, price_date: new Date().toISOString().split('T')[0], min_price: 3850, max_price: 4050, arrivals: 2500 },

  // Vegetables
  { id: '8', commodity: 'Tomato', market: 'Delhi - Mandi', state: 'Delhi', modal_price: 850, price_date: new Date().toISOString().split('T')[0], min_price: 750, max_price: 950, arrivals: 2000 },
  { id: '9', commodity: 'Onion', market: 'Maharashtra - Nashik', state: 'Maharashtra', modal_price: 1200, price_date: new Date().toISOString().split('T')[0], min_price: 1100, max_price: 1350, arrivals: 4000 },
  { id: '10', commodity: 'Potato', market: 'Punjab - Amritsar', state: 'Punjab', modal_price: 950, price_date: new Date().toISOString().split('T')[0], min_price: 900, max_price: 1000, arrivals: 3500 },
  { id: '11', commodity: 'Cabbage', market: 'Karnataka - Bangalore', state: 'Karnataka', modal_price: 650, price_date: new Date().toISOString().split('T')[0], min_price: 600, max_price: 700, arrivals: 1500 },

  // Pulses
  { id: '12', commodity: 'Chana (Gram)', market: 'Madhya Pradesh - Indore', state: 'Madhya Pradesh', modal_price: 5200, price_date: new Date().toISOString().split('T')[0], min_price: 5100, max_price: 5350, arrivals: 2500 },
  { id: '13', commodity: 'Urad', market: 'Andhra Pradesh - Hyderabad', state: 'Andhra Pradesh', modal_price: 7450, price_date: new Date().toISOString().split('T')[0], min_price: 7300, max_price: 7600, arrivals: 1800 },
  { id: '14', commodity: 'Moong', market: 'West Bengal - Kolkata', state: 'West Bengal', modal_price: 6800, price_date: new Date().toISOString().split('T')[0], min_price: 6600, max_price: 7000, arrivals: 1200 },

  // Oil & Spices
  { id: '15', commodity: 'Mustard Seed', market: 'Rajasthan - Jaipur', state: 'Rajasthan', modal_price: 6500, price_date: new Date().toISOString().split('T')[0], min_price: 6300, max_price: 6700, arrivals: 800 },
  { id: '16', commodity: 'Turmeric', market: 'Telangana - Hyderabad', state: 'Telangana', modal_price: 8200, price_date: new Date().toISOString().split('T')[0], min_price: 8000, max_price: 8500, arrivals: 600 },
  { id: '17', commodity: 'Chilly', market: 'Andhra Pradesh - Guntur', state: 'Andhra Pradesh', modal_price: 9500, price_date: new Date().toISOString().split('T')[0], min_price: 9200, max_price: 9800, arrivals: 1200 },

  // Cotton
  { id: '18', commodity: 'Cotton', market: 'Maharashtra - Akola', state: 'Maharashtra', modal_price: 6850, price_date: new Date().toISOString().split('T')[0], min_price: 6700, max_price: 7000, arrivals: 500 },
  { id: '19', commodity: 'Cotton', market: 'Andhra Pradesh - Warangal', state: 'Andhra Pradesh', modal_price: 6950, price_date: new Date().toISOString().split('T')[0], min_price: 6800, max_price: 7100, arrivals: 600 },

  // Fruits
  { id: '20', commodity: 'Apple', market: 'Himachal Pradesh - Shimla', state: 'Himachal Pradesh', modal_price: 3500, price_date: new Date().toISOString().split('T')[0], min_price: 3300, max_price: 3800, arrivals: 800 },
  { id: '21', commodity: 'Mango', market: 'Karnataka - Bangalore', state: 'Karnataka', modal_price: 2800, price_date: new Date().toISOString().split('T')[0], min_price: 2600, max_price: 3000, arrivals: 1500 },
  { id: '22', commodity: 'Banana', market: 'Maharashtra - Jalna', state: 'Maharashtra', modal_price: 1850, price_date: new Date().toISOString().split('T')[0], min_price: 1750, max_price: 1950, arrivals: 2000 },

  // Sugarcane
  { id: '23', commodity: 'Sugarcane', market: 'Uttar Pradesh - Lucknow', state: 'Uttar Pradesh', modal_price: 310, price_date: new Date().toISOString().split('T')[0], min_price: 300, max_price: 320, arrivals: 7000 },
  { id: '24', commodity: 'Sugarcane', market: 'Maharashtra - Pune', state: 'Maharashtra', modal_price: 325, price_date: new Date().toISOString().split('T')[0], min_price: 315, max_price: 335, arrivals: 5500 },
  { id: '25', commodity: 'Sugarcane', market: 'Karnataka - Belgaum', state: 'Karnataka', modal_price: 318, price_date: new Date().toISOString().split('T')[0], min_price: 308, max_price: 328, arrivals: 4200 },
];

// Generate historical data for price trends (last 30 days) with realistic trends
const generateHistoricalPrices = () => {
  const historical = [];

  // Define commodity trends over 30 days
  const commodityTrends = {
    'Wheat': { basePrice: 2150, market: 'Delhi - Mandi', trend: 'up', changePercent: 2.5 },     // Uptrend
    'Rice (Common)': { basePrice: 2850, market: 'Tamil Nadu - Chennai', trend: 'down', changePercent: -1.8 },  // Downtrend
    'Onion': { basePrice: 1200, market: 'Maharashtra - Nashik', trend: 'up', changePercent: 3.5 },            // Strong uptrend
    'Tomato': { basePrice: 850, market: 'Delhi - Mandi', trend: 'down', changePercent: -2.2 },     // Downtrend
    'Chana (Gram)': { basePrice: 5200, market: 'Madhya Pradesh - Indore', trend: 'stable', changePercent: 0.8 }, // Stable
    'Cotton': { basePrice: 6850, market: 'Maharashtra - Akola', trend: 'up', changePercent: 1.5 },            // Slight uptrend
    'Sugarcane': { basePrice: 310, market: 'Uttar Pradesh - Lucknow', trend: 'up', changePercent: 2.0 }       // Uptrend
  };

  let id = 100;
  const commodities = Object.keys(commodityTrends);

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayProgress = (30 - i) / 30; // 0 to 1 as we go from day 30 to day 0

    commodities.forEach(commodity => {
      const trendData = commodityTrends[commodity];
      const basePrice = trendData.basePrice;

      // Calculate trend-based price movement
      let trendPrice = basePrice;
      if (trendData.trend === 'up') {
        trendPrice = basePrice * (1 + (dayProgress * trendData.changePercent / 100));
      } else if (trendData.trend === 'down') {
        trendPrice = basePrice * (1 + (dayProgress * trendData.changePercent / 100));
      } else {
        // Stable trend with minimal variation
        trendPrice = basePrice + (Math.random() - 0.5) * (basePrice * 0.01);
      }

      // Add small daily fluctuation
      const dailyFluctuation = (Math.random() - 0.5) * (basePrice * 0.02);
      const finalPrice = trendPrice + dailyFluctuation;

      historical.push({
        id: String(id++),
        commodity,
        market: trendData.market,
        modal_price: Math.round(finalPrice),
        price_date: dateStr,
        min_price: Math.round(finalPrice - 50),
        max_price: Math.round(finalPrice + 50),
        arrivals: Math.floor(Math.random() * 5000) + 1000
      });
    });
  }
  return historical;
};

const historicalPrices = generateHistoricalPrices();

const mockDatabase = {
  // Supabase-like interface
  from(table) {
    const self = this;
    let state = {
      table,
      filters: {},
      iLikeFilters: [],
      gteFilters: [],
      orderBy: [],
      limitValue: null,
      offsetValue: null,
      countMode: false
    };

    // Get data based on table
    const getTableData = () => {
      if (table === 'users') {
        return Array.from(users.values()).filter(u => typeof u.id === 'string' && u.id.length < 10);
      } else if (table === 'market_prices') {
        return [...realMarketPrices, ...historicalPrices];
      } else if (table === 'schemes') {
        return realSchemes;
      } else if (table === 'shipments') {
        return Array.from(shipments.values());
      }
      return [];
    };

    // Apply all filters
    const applyFilters = (data) => {
      let filtered = data;

      // Apply eq filters
      for (let key in state.filters) {
        filtered = filtered.filter(item => item[key] === state.filters[key]);
      }

      // Apply ilike filters
      for (let ilike of state.iLikeFilters) {
        filtered = filtered.filter(item => {
          if (!item[ilike.column]) return false;
          return String(item[ilike.column]).toLowerCase().includes(ilike.value.toLowerCase());
        });
      }

      // Apply gte filters
      for (let gte of state.gteFilters) {
        filtered = filtered.filter(item => item[gte.column] >= gte.value);
      }

      return filtered;
    };

    // Apply ordering
    const applyOrder = (data) => {
      if (state.orderBy.length === 0) return data;

      const sorted = [...data];
      for (let order of state.orderBy) {
        sorted.sort((a, b) => {
          const aVal = a[order.column];
          const bVal = b[order.column];
          if (typeof aVal === 'string') {
            const comparison = aVal.localeCompare(bVal);
            return order.ascending ? comparison : -comparison;
          }
          return order.ascending ? aVal - bVal : bVal - aVal;
        });
      }
      return sorted;
    };

    const queryBuilder = {
      select(columns = '*', options = {}) {
        if (options.count) {
          state.countMode = options.count === 'exact';
        }
        return this;
      },

      eq(column, value) {
        state.filters[column] = value;
        return this;
      },

      ilike(column, searchVal) {
        state.iLikeFilters.push({
          column,
          value: searchVal.replace(/%/g, '')
        });
        return this;
      },

      limit(num) {
        state.limitValue = num;
        return this;
      },

      range(from, to) {
        state.offsetValue = from;
        state.limitValue = (to - from) + 1;
        return this;
      },

      order(column, options = {}) {
        state.orderBy.push({
          column,
          ascending: options.ascending !== false
        });
        return this;
      },

      gte(column, value) {
        state.gteFilters.push({
          column,
          value
        });
        return this;
      },

      single() {
        const self = this;
        const result = {
          then(onFulfilled, onRejected) {
            const promise = Promise.resolve().then(() => {
              const data = getTableData();
              const filtered = applyFilters(data);
              const ordered = applyOrder(filtered);
              return { data: ordered[0] || null, error: ordered[0] ? null : null };
            });
            return promise.then(onFulfilled, onRejected);
          }
        };
        return result;
      },

      async execute() {
        let data = getTableData();
        data = applyFilters(data);
        data = applyOrder(data);

        const totalCount = data.length;

        if (state.offsetValue !== null && state.limitValue !== null) {
          data = data.slice(state.offsetValue, state.offsetValue + state.limitValue);
        } else if (state.limitValue !== null) {
          data = data.slice(0, state.limitValue);
        }

        if (state.countMode) {
          return {
            data,
            error: null,
            count: totalCount
          };
        }

        return { data, error: null };
      },

      // Make queryBuilder thenable (awaitable)
      then(onFulfilled, onRejected) {
        const executePromise = Promise.resolve().then(() => this.execute());
        return executePromise.then(onFulfilled, onRejected);
      },

      async() {
        return this.execute();
      }
    };

    return {
      select(columns = '*', options = {}) {
        if (options.count) {
          state.countMode = options.count === 'exact';
        }
        return queryBuilder;
      },

      insert(records) {
        return {
          select() {
            const resultBuilder = {
              // Thenable — resolves with inserted data array
              then(onFulfilled, onRejected) {
                const promise = Promise.resolve().then(() => {
                  try {
                    const insertedRecords = [];
                    for (const record of records) {
                      if (table === 'shipments') {
                        const newRecord = { ...record };
                        shipments.set(newRecord.id || newRecord.shipment_id, newRecord);
                        insertedRecords.push(newRecord);
                      } else if (table === 'users') {
                        const id = String(userIdCounter++);
                        const newUser = {
                          id,
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                          ...record
                        };
                        users.set(id, newUser);
                        if (newUser.phone) users.set(newUser.phone, newUser);
                        insertedRecords.push(newUser);
                      }
                    }
                    return { data: insertedRecords, error: null };
                  } catch (error) {
                    return { data: null, error };
                  }
                });
                return promise.then(onFulfilled, onRejected);
              },
              async single() {
                try {
                  const record = records[0];
                  if (table === 'shipments') {
                    const newRecord = { ...record };
                    shipments.set(newRecord.id || newRecord.shipment_id, newRecord);
                    return { data: newRecord, error: null };
                  } else if (table === 'users') {
                    const id = String(userIdCounter++);
                    const newUser = {
                      id,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      ...record
                    };
                    users.set(id, newUser);
                    if (newUser.phone) users.set(newUser.phone, newUser);
                    return { data: newUser, error: null };
                  }
                  return { data: null, error: new Error('Unknown table') };
                } catch (error) {
                  return { data: null, error };
                }
              },
              async() {
                const insertedRecords = [];
                for (const record of records) {
                  if (table === 'shipments') {
                    const newRecord = { ...record };
                    shipments.set(newRecord.id || newRecord.shipment_id, newRecord);
                    insertedRecords.push(newRecord);
                  } else if (table === 'users') {
                    const id = String(userIdCounter++);
                    const newUser = {
                      id,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      ...record
                    };
                    users.set(id, newUser);
                    if (newUser.phone) users.set(newUser.phone, newUser);
                    insertedRecords.push(newUser);
                  }
                }
                return { data: insertedRecords, error: null };
              }
            };
            return resultBuilder;
          }
        };
      },

      update(updates) {
        return {
          eq(column, value) {
            state.filters[column] = value;
            return {
              select() {
                const resultBuilder = {
                  then(onFulfilled, onRejected) {
                    const promise = Promise.resolve().then(() => {
                      if (table === 'shipments') {
                        const allShipments = Array.from(shipments.values());
                        const matching = allShipments.filter(s => s[column] === value);
                        const updatedRecords = [];
                        for (const record of matching) {
                          const updatedRecord = { ...record, ...updates };
                          shipments.set(updatedRecord.id || updatedRecord.shipment_id, updatedRecord);
                          updatedRecords.push(updatedRecord);
                        }
                        return { data: updatedRecords, error: null };
                      } else if (table === 'users') {
                        const user = users.get(value);
                        if (!user) return { data: null, error: new Error('User not found') };
                        const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
                        users.set(value, updated);
                        if (updated.phone) users.set(updated.phone, updated);
                        return { data: [updated], error: null };
                      }
                      return { data: [], error: null };
                    });
                    return promise.then(onFulfilled, onRejected);
                  },
                  async single() {
                    if (table === 'users') {
                      const user = users.get(value);
                      if (!user) return { data: null, error: new Error('User not found') };
                      const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
                      users.set(value, updated);
                      if (updated.phone) users.set(updated.phone, updated);
                      return { data: updated, error: null };
                    } else if (table === 'shipments') {
                      const allShipments = Array.from(shipments.values());
                      const record = allShipments.find(s => s[column] === value);
                      if (!record) return { data: null, error: new Error('Shipment not found') };
                      const updatedRecord = { ...record, ...updates };
                      shipments.set(updatedRecord.id || updatedRecord.shipment_id, updatedRecord);
                      return { data: updatedRecord, error: null };
                    }
                    return { data: null, error: new Error('Not found') };
                  }
                };
                return resultBuilder;
              },
              then(onFulfilled, onRejected) {
                const promise = Promise.resolve().then(() => {
                  if (table === 'shipments') {
                    const allShipments = Array.from(shipments.values());
                    const matching = allShipments.filter(s => s[column] === value);
                    for (const record of matching) {
                      const updatedRecord = { ...record, ...updates };
                      shipments.set(updatedRecord.id || updatedRecord.shipment_id, updatedRecord);
                    }
                    return { data: null, error: null };
                  }
                  return { data: null, error: null };
                });
                return promise.then(onFulfilled, onRejected);
              }
            };
          }
        };
      },

      delete() {
        return {
          eq(column, value) {
            return {
              then(onFulfilled, onRejected) {
                const promise = Promise.resolve().then(() => {
                  if (table === 'users') {
                    users.delete(value);
                  } else if (table === 'shipments') {
                    // Find and delete by matching column value
                    const allShipments = Array.from(shipments.entries());
                    for (const [key, record] of allShipments) {
                      if (record[column] === value) {
                        shipments.delete(key);
                      }
                    }
                  }
                  return { data: null, error: null };
                });
                return promise.then(onFulfilled, onRejected);
              },
              async() {
                if (table === 'users') {
                  users.delete(value);
                } else if (table === 'shipments') {
                  const allShipments = Array.from(shipments.entries());
                  for (const [key, record] of allShipments) {
                    if (record[column] === value) {
                      shipments.delete(key);
                    }
                  }
                }
                return { data: null, error: null };
              }
            };
          }
        };
      }
    };
  }
};

module.exports = mockDatabase;

