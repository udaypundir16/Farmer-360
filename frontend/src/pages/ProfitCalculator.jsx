import { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function ProfitCalculator() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    cropType: 'Wheat',
    landArea: '',
    productionCost: '',
    expectedYield: '',
    expectedPrice: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/profit-calculator/calculate', formData);
      const data = response.data;

      if (data.success && data.data) {
        setResult(data.data);
        setError('');
      } else {
        setResult(data.data || data);
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[0] || err.response?.data?.message || t('common.error');
      setError(msg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level.includes('Low') && !level.includes('Medium')) return 'text-green-600';
    if (level.includes('Medium') && !level.includes('High')) return 'text-yellow-600';
    if (level.includes('High')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRiskBgColor = (level) => {
    if (level.includes('Low') && !level.includes('Medium')) return 'bg-green-50 border-green-200';
    if (level.includes('Medium') && !level.includes('High')) return 'bg-yellow-50 border-yellow-200';
    if (level.includes('High')) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  const crops = [
    'Wheat',
    'Rice',
    'Cotton',
    'Sugarcane',
    'Corn',
    'Potato',
    'Tomato',
    'Onion',
    'Soybean',
    'Barley',
  ];

  return (
    <div className="min-h-screen bg-cream-100 py-8">
      <div className="container mx-auto p-4">
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-block px-6 py-3 rounded-agri-lg bg-white/80 backdrop-blur-sm border border-primary-100 shadow-agri">
            <h1 className="font-heading text-3xl font-bold text-primary-800 flex items-center gap-3">
              <DollarSign className="text-primary-600" size={32} />
              {t('profit_calculator.title')}
            </h1>
            <p className="text-soil-light mt-2">{t('profit_calculator.subtitle')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 border-primary-100 shadow-agri">
              <CardHeader>
                <CardTitle className="text-lg text-soil flex items-center gap-2">
                  <Zap size={20} className="text-primary-600" />
                  {t('prediction.form_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCalculate} className="space-y-4">
                  {/* Crop Type */}
                  <div>
                    <label className="block text-sm font-semibold text-soil mb-2">{t('profit_calculator.crop_type')}</label>
                    <select
                      name="cropType"
                      value={formData.cropType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary-200 rounded-agri bg-cream-50 focus:border-primary-500 focus:outline-none"
                    >
                      {crops.map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Land Area */}
                  <div>
                    <label className="block text-sm font-semibold text-soil mb-2">
                      {t('profit_calculator.land_area')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="landArea"
                      value={formData.landArea}
                      onChange={handleInputChange}
                      placeholder={t('profit_calculator.enter_land_area')}
                      className="w-full px-3 py-2 border border-primary-200 rounded-agri bg-cream-50 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  {/* Production Cost */}
                  <div>
                    <label className="block text-sm font-semibold text-soil mb-2">
                      {t('profit_calculator.production_cost')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="productionCost"
                      value={formData.productionCost}
                      onChange={handleInputChange}
                      placeholder={t('profit_calculator.enter_cost')}
                      className="w-full px-3 py-2 border border-primary-200 rounded-agri bg-cream-50 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  {/* Expected Yield */}
                  <div>
                    <label className="block text-sm font-semibold text-soil mb-2">
                      {t('profit_calculator.expected_yield')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="expectedYield"
                      value={formData.expectedYield}
                      onChange={handleInputChange}
                      placeholder={t('profit_calculator.enter_yield')}
                      className="w-full px-3 py-2 border border-primary-200 rounded-agri bg-cream-50 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  {/* Expected Price */}
                  <div>
                    <label className="block text-sm font-semibold text-soil mb-2">
                      {t('profit_calculator.expected_price')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="expectedPrice"
                      value={formData.expectedPrice}
                      onChange={handleInputChange}
                      placeholder={t('profit_calculator.enter_price')}
                      className="w-full px-3 py-2 border border-primary-200 rounded-agri bg-cream-50 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-agri text-red-700 text-sm flex items-start gap-2">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Calculate Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-700 to-primary-600 text-white py-2 rounded-agri font-semibold hover:shadow-agri disabled:opacity-50 transition-all"
                  >
                    {loading ? t('profit_calculator.calculating') : t('profit_calculator.calculate_btn')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-4 animate-fade-in-up">
                {/* Summary Card */}
                <Card
                  className={`border-2 ${result.summary.estimatedProfit >= 0
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                    : 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50'
                    } shadow-agri`}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl text-soil flex items-center gap-2">
                      {result.summary.estimatedProfit >= 0 ? (
                        <>
                          <TrendingUp className="text-green-600" size={28} />
                          {t('profit_calculator.profitable')}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="text-red-600" size={28} />
                          {t('profit_calculator.loss')}
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-soil-light text-sm mb-1">{t('profit_calculator.total_revenue')}</p>
                        <p className="text-2xl font-bold text-primary-700">
                          ₹{result.summary.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-soil-light text-sm mb-1">{t('profit_calculator.total_investment')}</p>
                        <p className="text-2xl font-bold text-earth-600">
                          ₹{result.summary.totalCost.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2 p-4 bg-white/60 rounded-agri border border-primary-100">
                        <p className="text-soil-light text-sm mb-2">{t('profit_calculator.net_profit')}</p>
                        <p
                          className={`text-3xl font-bold ${result.summary.estimatedProfit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                          ₹{result.summary.estimatedProfit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Metrics */}
                <Card className="bg-white/95 border-primary-100">
                  <CardHeader>
                    <CardTitle className="text-lg text-soil">{t('profit_calculator.results_title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-cream-50 rounded-agri">
                      <span className="text-soil-light">{t('profit_calculator.profit_status')}</span>
                      <span className="font-bold text-primary-700">
                        {result.summary.profitMarginPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cream-50 rounded-agri">
                      <span className="text-soil-light">{t('profit_calculator.roi')}</span>
                      <span className="font-bold text-primary-700">{result.summary.roiPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cream-50 rounded-agri">
                      <span className="text-soil-light">{t('profit_calculator.production_cost')}</span>
                      <span className="font-bold text-earth-600">₹{result.unitAnalysis.costPerUnit}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cream-50 rounded-agri">
                      <span className="text-soil-light">{t('profit_calculator.expected_price')}</span>
                      <span className="font-bold text-green-600">₹{result.unitAnalysis.revenuePerUnit}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Indicator */}
                <Card className={`border-2 ${getRiskBgColor(result.riskIndicator.level)}`}>
                  <CardHeader>
                    <CardTitle className={`text-lg flex items-center gap-2 ${getRiskColor(result.riskIndicator.level)}`}>
                      <AlertCircle size={20} />
                      {t('profit_calculator.profit_status')}: {result.riskIndicator.level}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-soil text-sm">{result.riskIndicator.reasoning}</p>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="bg-white/95 border-primary-100">
                  <CardHeader>
                    <CardTitle className="text-lg text-soil flex items-center gap-2">
                      <CheckCircle className="text-primary-600" size={20} />
                      {t('prediction.recommendations')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-2">
                          <span className="text-primary-600 font-bold flex-shrink-0">•</span>
                          <span className="text-soil text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-primary-50 to-crop/20 border-primary-100 h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <DollarSign className="mx-auto text-primary-300 mb-4" size={64} />
                  <p className="text-soil-light text-lg">
                    {t('profit_calculator.subtitle')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
