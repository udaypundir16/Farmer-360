exports.getCropCalendar = async (req, res, next) => {
  try {
    const { month, crop } = req.query;
    
    // Comprehensive crop calendar data for India
    const calendarData = {
      crops: [
        {
          id: 'wheat',
          name: 'Wheat',
          season: 'Rabi',
          months: [10, 11, 0, 1, 2, 3],
          activities: {
            10: { 
              sowing: 'Sow seeds at 100-125 kg/hectare',
              'land_preparation': 'Prepare field, remove weeds',
              irrigation: 'Initial light irrigation if needed',
              fertilizer: 'Apply 50 kg N, 25 kg P, 25 kg K per hectare'
            },
            11: { 
              irrigation: 'First irrigation at CRI stage',
              pest: 'Monitor armyworms and aphids',
              'weed_control': 'Manual weeding if required'
            },
            0: { 
              irrigation: 'Second and third irrigation at crown root initiation',
              fertilizer: 'Top dressing with 50 kg nitrogen',
              pest: 'Check for Hessian flies and stem borers'
            },
            1: { 
              irrigation: 'Maintain soil moisture',
              pest: 'Monitor for diseases like loose smut',
              'fertilizer': 'Final nitrogen application if required'
            },
            2: { 
              'pre_harvest': 'Monitor crop maturity',
              irrigation: 'Withhold irrigation'
            },
            3: { 
              harvest: '105-110 days to maturity - begin harvesting',
              'post_harvest': 'Dry and store in cool, dry place'
            }
          }
        },
        {
          id: 'rice',
          name: 'Rice',
          season: 'Kharif',
          months: [5, 6, 7, 8, 9],
          activities: {
            5: { 
              'nursery_prep': 'Prepare nursery beds on high ground',
              sowing: 'Sow 20-25 kg seeds per hectare',
              'land_prep': 'Apply FYM and prepare main field'
            },
            6: { 
              transplant: 'Transplant when seedlings are 30-35 days old',
              irrigation: 'Maintain 5 cm water level',
              fertilizer: 'Apply basal fertilizer 60:30:30 NPK'
            },
            7: { 
              irrigation: 'Maintain optimal water level',
              fertilizer: 'Apply first top dressing at 30 days',
              pest: 'Monitor for stem borer, leaf folder'
            },
            8: { 
              irrigation: 'Critical stage - ensure water availability',
              fertilizer: 'Apply second top dressing',
              pest: 'Control sheath blight and blast disease'
            },
            9: { 
              'pre_harvest': 'Check grain maturity',
              irrigation: 'Drain fields 7-10 days before harvest',
              harvest: 'Harvest when 70-80% of panicles turn golden'
            }
          }
        },
        {
          id: 'cotton',
          name: 'Cotton',
          season: 'Kharif',
          months: [5, 6, 7, 8, 9, 10],
          activities: {
            5: { 
              'land_prep': 'Deep plowing, add FYM 5 tonnes/hectare',
              sowing: 'Sow at 20 kg/hectare with proper spacing',
              irrigation: 'First irrigation immediately after sowing'
            },
            6: { 
              irrigation: 'Provide 2-3 irrigations at 15-20 day interval',
              'weed_control': 'First weeding at 35-40 days',
              fertilizer: 'Apply nitrogen and potassium'
            },
            7: { 
              irrigation: 'Critical water period - maintain moisture',
              fertilizer: 'Top dressing with potassium and zinc',
              pest: 'Monitor for pink bollworm, jassids'
            },
            8: { 
              irrigation: 'Continue regular irrigation',
              pest: 'Control aphids, mites with appropriate pesticides',
              'boll_care': 'Support plants to prevent lodging'
            },
            9: { 
              irrigation: 'Reduce irrigation frequency',
              pest: 'Continue pest monitoring',
              'defoliation': 'Apply defoliants if required'
            },
            10: { 
              harvest: 'Begin picking when 50% bolls open',
              'post_harvest': 'Dry cotton properly before ginning'
            }
          }
        },
        {
          id: 'maize',
          name: 'Maize',
          season: 'Kharif',
          months: [5, 6, 7, 8],
          activities: {
            5: { 
              'land_prep': 'Prepare field with 25 tonnes FYM per hectare',
              sowing: 'Sow hybrid seeds at 20 kg/hectare',
              irrigation: 'Light irrigation after sowing'
            },
            6: { 
              irrigation: 'Regular irrigation every 10-12 days',
              'weed_control': 'First weeding at 30-35 days',
              fertilizer: 'Apply NPK 80:40:40 kg/hectare'
            },
            7: { 
              'critical_stage': 'Silking and pollination stage - ensure soil moisture',
              fertilizer: 'Top dressing with nitrogen',
              pest: 'Monitor for FAW, stem borer'
            },
            8: { 
              'grain_fill': 'Maintain moisture during grain filling',
              pest: 'Continue pest control measures',
              irrigation: 'Last irrigation at milk stage'
            }
          }
        },
        {
          id: 'sugarcane',
          name: 'Sugarcane',
          season: 'Year-round',
          months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          activities: {
            0: { 'field_prep': 'Prepare field, leave standing crop for spring planting' },
            1: { 'spring_planting': 'Plant sugarcane sets in winter season' },
            2: { 'establishment': 'Ensure plantlet emergence' },
            3: { irrigation: 'Regular irrigation during summer' },
            4: { 'peak_water': 'Add 5-7 irrigations during peak water demand' },
            5: { fertilizer: 'Apply phosphorus and potassium fertilizers' },
            6: { 'monsoon_care': 'Manage water logging if it occurs' },
            7: { 'weed_control': 'Earthing up - last plowing' },
            8: { pest: 'Monitor for stem borer, red rot' },
            9: { 'maturation': 'Crop matures - increase ripening' },
            10: { harvest: 'Commence harvesting when mature' },
            11: { harvest: 'Continue harvesting - store in cool place' }
          }
        },
        {
          id: 'pulses',
          name: 'Pulses',
          season: 'Rabi',
          months: [9, 10, 11, 0, 1, 2],
          activities: {
            9: { 'field_prep': 'Prepare field, incorporate organic matter' },
            10: { sowing: 'Sow pulses like gram, lentil at proper spacing' },
            11: { 'establishment': 'Ensure good seedling emergence and vigor' },
            0: { 'weed_control': 'Weeding at 40-50 days after sowing' },
            1: { 
              flowering: 'Critical water period during flowering',
              pest: 'Monitor for pod borers and bruchids'
            },
            2: { harvest: 'Harvest when pods turn brown and dry' }
          }
        },
        {
          id: 'groundnut',
          name: 'Groundnut',
          season: 'Kharif',
          months: [5, 6, 7, 8, 9],
          activities: {
            5: { 
              'land_prep': 'Deep plowing and add FYM',
              sowing: 'Sow at 90-110 kg/hectare with spacing'
            },
            6: { 
              irrigation: 'First irrigation after emergence',
              'weed_control': 'First weeding at 30-35 days'
            },
            7: { 
              irrigation: 'Second irrigation',
              fertilizer: 'Apply calcium and micronutrients'
            },
            8: { 
              'pin_formation': 'Critical stage - ensure moisture',
              irrigation: 'Regular irrigation'
            },
            9: { harvest: 'Harvest when pods mature - about 130-150 days' }
          }
        }
      ]
    };

    // Monthly weather/climate data for India (averages)
    const monthlyWeather = [
      { month: 0, name: 'January', temp: '15-25°C', rainfall: 'Low', humidity: '50-60%' },
      { month: 1, name: 'February', temp: '17-28°C', rainfall: 'Low', humidity: '50-60%' },
      { month: 2, name: 'March', temp: '21-32°C', rainfall: 'Low', humidity: '55-65%' },
      { month: 3, name: 'April', temp: '25-36°C', rainfall: 'Low-Moderate', humidity: '45-55%' },
      { month: 4, name: 'May', temp: '28-38°C', rainfall: 'Moderate', humidity: '40-50%' },
      { month: 5, name: 'June', temp: '25-32°C', rainfall: 'High', humidity: '65-75%' },
      { month: 6, name: 'July', temp: '23-30°C', rainfall: 'Very High', humidity: '70-80%' },
      { month: 7, name: 'August', temp: '23-30°C', rainfall: 'Very High', humidity: '70-80%' },
      { month: 8, name: 'September', temp: '23-32°C', rainfall: 'High', humidity: '65-75%' },
      { month: 9, name: 'October', temp: '20-30°C', rainfall: 'Moderate', humidity: '55-65%' },
      { month: 10, name: 'November', temp: '16-28°C', rainfall: 'Low', humidity: '50-60%' },
      { month: 11, name: 'December', temp: '13-25°C', rainfall: 'Low', humidity: '50-60%' }
    ];

    let filteredCrops = calendarData.crops;
    const monthNum = month !== undefined ? parseInt(month) : null;
    
    if (monthNum !== null) {
      filteredCrops = filteredCrops.filter(crop => crop.months.includes(monthNum));
    }
    if (crop) {
      filteredCrops = filteredCrops.filter(c => c.id === crop);
    }

    const weatherData = monthNum !== null ? monthlyWeather[monthNum] : null;

    res.json({ 
      crops: filteredCrops,
      weather: weatherData,
      allMonthsWeather: monthlyWeather
    });
  } catch (error) {
    next(error);
  }
};

exports.getCropActivities = async (req, res, next) => {
  try {
    const { cropId, month } = req.params;
    const monthNum = parseInt(month);

    // Mock activities data
    const activities = {
      wheat: {
        10: { sowing: 'Sow seeds', irrigation: 'Initial irrigation', fertilizer: 'Apply NPK' },
        11: { irrigation: 'Regular irrigation', pest: 'Monitor for pests' },
        0: { irrigation: 'Critical irrigation stage', fertilizer: 'Top dressing' },
        1: { irrigation: 'Maintain soil moisture', pest: 'Check for diseases' },
        2: { harvest: 'Harvest time', irrigation: 'Stop irrigation' },
      },
      rice: {
        5: { sowing: 'Nursery preparation', irrigation: 'Prepare paddy fields' },
        6: { transplant: 'Transplant seedlings', irrigation: 'Flood fields' },
        7: { irrigation: 'Maintain water level', fertilizer: 'Apply nitrogen' },
        8: { irrigation: 'Critical stage', pest: 'Pest control' },
        9: { harvest: 'Harvest paddy', irrigation: 'Drain fields' },
      },
    };

    const cropActivities = activities[cropId]?.[monthNum] || { general: 'Regular maintenance' };

    res.json({ activities: cropActivities });
  } catch (error) {
    next(error);
  }
};

exports.getCropRecommendations = async (req, res, next) => {
  try {
    const { state, season } = req.query;

    // Mock recommendations based on state and season
    const recommendations = [
      {
        crop: 'Wheat',
        reason: 'Ideal climate conditions',
        yield: 'High',
        marketPrice: 'Good',
        suitability: 95
      },
      {
        crop: 'Rice',
        reason: 'Adequate water availability',
        yield: 'Very High',
        marketPrice: 'Excellent',
        suitability: 90
      },
    ];

    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
};
