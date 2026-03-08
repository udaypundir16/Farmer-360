/**
 * Profit Calculator Controller
 * Handles HTTP requests for profit calculations
 */

const profitCalculatorService = require('../services/profit-calculator.service');
const logger = require('../utils/logger');

class ProfitCalculatorController {
  /**
   * Calculate crop profit/loss
   * @route POST /api/v1/profit-calculator/calculate
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async calculateProfit(req, res) {
    try {
      const { cropType, landArea, productionCost, expectedYield, expectedPrice } = req.body;

      // Validate that required fields are provided
      if (!cropType || landArea === undefined || productionCost === undefined || expectedYield === undefined || expectedPrice === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: cropType, landArea, productionCost, expectedYield, expectedPrice',
        });
      }

      // Perform calculation
      const result = profitCalculatorService.calculateProfit({
        cropType,
        landArea,
        productionCost,
        expectedYield,
        expectedPrice,
      });

      // Log the calculation
      logger.info({
        message: 'Profit calculation performed',
        cropType,
        success: result.success,
        profit: result.summary?.estimatedProfit,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        success: true,
        message: 'Profit calculation completed successfully',
        data: result,
      });
    } catch (error) {
      logger.error({
        message: 'Error in profit calculation',
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: 'Error calculating profit',
        error: error.message,
      });
    }
  }

  /**
   * Get calculator info and sample calculations
   * @route GET /api/v1/profit-calculator/info
   */
  async getCalculatorInfo(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Profit Calculator Information',
        description: 'Calculate estimated profit/loss for crops based on production costs and market prices',
        requiredFields: {
          cropType: 'Type of crop (e.g., Wheat, Rice, Cotton)',
          landArea: 'Area of land in hectares or acres',
          productionCost: 'Total production cost in currency units',
          expectedYield: 'Expected yield in kg or tons',
          expectedPrice: 'Expected market price per unit',
        },
        calculatedFields: {
          totalRevenue: 'Expected Yield * Expected Market Price',
          totalCost: 'Production Cost',
          estimatedProfit: 'Total Revenue - Total Cost',
          profitMarginPercent: '(Profit / Revenue) * 100',
          roiPercent: '(Profit / Cost) * 100',
        },
        riskLevels: {
          Low: 'Profit margin >= 30% and ROI >= 50%',
          'Low-Medium': 'Profit margin >= 15% and ROI >= 25%',
          Medium: 'Profit margin >= 5% and ROI >= 10%',
          'Medium-High': 'Positive profit but thin margins',
          High: 'Negative profit or significant loss',
        },
      });
    } catch (error) {
      logger.error('Error fetching calculator info', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching calculator information',
      });
    }
  }
}

module.exports = new ProfitCalculatorController();
