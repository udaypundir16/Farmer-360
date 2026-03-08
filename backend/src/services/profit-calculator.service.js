/**
 * Profit Calculator Service
 * Handles all profit calculation logic for crop profitability analysis
 */

class ProfitCalculatorService {
  /**
   * Validate input data
   * @param {Object} input - Calculation input data
   * @returns {Object} - Validation result with errors array
   */
  validateInput(input) {
    const errors = [];

    // Required fields check
    if (!input.cropType || input.cropType.trim() === '') errors.push('Crop type is required');
    if (!input.landArea || input.landArea <= 0) errors.push('Land area must be greater than 0');
    if (!input.productionCost || input.productionCost < 0) errors.push('Production cost cannot be negative');
    if (!input.expectedYield || input.expectedYield <= 0) errors.push('Expected yield must be greater than 0');
    if (!input.expectedPrice || input.expectedPrice <= 0) errors.push('Expected market price must be greater than 0');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate profit/loss for a crop
   * @param {Object} input - Calculation input
   *   - cropType: string (e.g., "Wheat", "Rice")
   *   - landArea: number (in hectares/acres)
   *   - productionCost: number (in currency units)
   *   - expectedYield: number (in kg/tons)
   *   - expectedPrice: number (price per unit in currency)
   * @returns {Object} - Detailed calculation results
   */
  calculateProfit(input) {
    // Validate input first
    const validation = this.validateInput(input);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    try {
      // Extract and convert inputs to numbers
      const landArea = parseFloat(input.landArea);
      const productionCost = parseFloat(input.productionCost);
      const expectedYield = parseFloat(input.expectedYield);
      const expectedPrice = parseFloat(input.expectedPrice);

      // Calculate total revenue
      // Revenue = Expected Yield * Expected Market Price
      const totalRevenue = expectedYield * expectedPrice;

      // Calculate total cost
      // Cost per hectare/unit * land area
      const totalCost = productionCost;

      // Calculate profit/loss
      const profit = totalRevenue - totalCost;

      // Calculate profit margin (%)
      // Margin = (Profit / Revenue) * 100
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      // Calculate ROI (Return on Investment)
      // ROI = (Profit / Cost) * 100
      const roi = productionCost > 0 ? (profit / productionCost) * 100 : 0;

      // Determine risk indicator based on profit margin
      const riskIndicator = this.calculateRiskIndicator(profitMargin, roi);

      // Cost per hectare/acre
      const costPerUnit = landArea > 0 ? (productionCost / landArea).toFixed(2) : 0;

      // Revenue per hectare/acre
      const revenuePerUnit = landArea > 0 ? (totalRevenue / landArea).toFixed(2) : 0;

      return {
        success: true,
        cropType: input.cropType,
        landArea,
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCost: Math.round(totalCost * 100) / 100,
          estimatedProfit: Math.round(profit * 100) / 100,
          profitMarginPercent: Math.round(profitMargin * 100) / 100,
          roiPercent: Math.round(roi * 100) / 100,
        },
        unitAnalysis: {
          costPerUnit,
          revenuePerUnit,
          profitPerUnit: (revenuePerUnit - costPerUnit).toFixed(2),
        },
        riskIndicator,
        recommendations: this.generateRecommendations(profitMargin, roi, profit),
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Error during calculation: ' + error.message],
      };
    }
  }

  /**
   * Calculate risk indicator based on profit margin and ROI
   * @param {number} profitMargin - Profit margin percentage
   * @param {number} roi - Return on investment percentage
   * @returns {Object} - Risk indicator with level and reasoning
   */
  calculateRiskIndicator(profitMargin, roi) {
    let level = 'Medium';
    let reasoning = '';

    // Risk assessment logic
    if (profitMargin >= 30 && roi >= 50) {
      level = 'Low';
      reasoning = 'High profit margin and ROI indicate low financial risk';
    } else if (profitMargin >= 15 && roi >= 25) {
      level = 'Low-Medium';
      reasoning = 'Good profitability with reasonable returns';
    } else if (profitMargin >= 5 && roi >= 10) {
      level = 'Medium';
      reasoning = 'Moderate profit margins with acceptable returns';
    } else if (profitMargin >= 0 && roi >= 0) {
      level = 'Medium-High';
      reasoning = 'Low profit margins indicate higher financial risk';
    } else if (profitMargin < 0) {
      level = 'High';
      reasoning = 'Negative profit margin indicates significant financial loss risk';
    }

    return {
      level,
      reasoning,
    };
  }

  /**
   * Generate actionable recommendations based on calculation
   * @param {number} profitMargin - Profit margin percentage
   * @param {number} roi - Return on investment percentage
   * @param {number} profit - Net profit amount
   * @returns {Array} - Array of recommendation strings
   */
  generateRecommendations(profitMargin, roi, profit) {
    const recommendations = [];

    if (profit < 0) {
      recommendations.push('⚠️ This crop will result in a loss. Consider reviewing your cost projections or crop selection.');
      recommendations.push('💡 Look for ways to reduce production costs or negotiate better prices.');
    } else if (profitMargin < 10) {
      recommendations.push('📊 Profit margins are thin. Explore cost-saving techniques.');
      recommendations.push('🏷️ Consider crop diversification to balance risk.');
    } else if (profitMargin >= 30) {
      recommendations.push('✅ Excellent profitability! This is a promising crop choice.');
      recommendations.push('📈 If feasible, consider scaling up production.');
    } else {
      recommendations.push('✅ Solid profitability. This crop is a reasonable investment.');
      recommendations.push('💰 Monitor market prices to maximize returns.');
    }

    if (roi >= 75) {
      recommendations.push('🚀 Outstanding ROI! Strong financial performance expected.');
    }

    recommendations.push('📝 Keep detailed records to compare projections with actual results.');

    return recommendations;
  }
}

module.exports = new ProfitCalculatorService();
