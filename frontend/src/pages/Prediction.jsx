import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import PredictionResult from "../components/prediction/PredictionResult";
import { useTranslation } from "react-i18next";

export default function Prediction() {
    const { t } = useTranslation();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cropType: "",
        landArea: "",
        soilType: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const data = {
                crop: formData.cropType,
                landArea: formData.landArea,
                soilType: formData.soilType,
            };
            // Simple calculation logic from user request
            data.predictedYield = `${(data.landArea * 6.5).toFixed(2) ?? 24} ${t('prediction.quintal')}`;
            data.recommendations = [
                t('prediction.rec_irrigation'),
                t('prediction.rec_fertilizer'),
                t('prediction.rec_pest'),
            ];
            setResult(data);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-cream-50 py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-10">
                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-800 mb-2">
                        {t('prediction.title')}
                    </h1>
                    <p className="text-soil-light">
                        {t('prediction.subtitle')}
                    </p>
                </div>

                {result ? (
                    <PredictionResult
                        result={result}
                        onBack={() => {
                            setResult(null);
                            setFormData({ cropType: "", landArea: "", soilType: "" });
                        }}
                    />
                ) : (
                    <Card className="max-w-xl mx-auto border-primary-100 shadow-agri card-agri">
                        <CardContent className="p-6 md:p-8">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {t('prediction.form_title')}
                                    </h2>
                                    <p className="text-sm text-gray-500">{t('prediction.form_subtitle')}</p>
                                </div>

                                {/* Crop Type */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700">{t('prediction.crop_type')}</Label>
                                    <select
                                        className="form-input-agri w-full rounded-lg border-gray-300 px-4 py-2.5 bg-white focus:border-primary-500 focus:ring-primary-500"
                                        value={formData.cropType}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cropType: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="" disabled>{t('prediction.select_crop')}</option>
                                        <option value="wheat">{t('prediction.crops.wheat')}</option>
                                        <option value="rice">{t('prediction.crops.rice')}</option>
                                        <option value="maize">{t('prediction.crops.maize')}</option>
                                        <option value="sugarcane">{t('prediction.crops.sugarcane')}</option>
                                        <option value="cotton">{t('prediction.crops.cotton')}</option>
                                    </select>
                                </div>

                                {/* Land Area */}
                                <div className="space-y-2">
                                    <Label htmlFor="landArea" className="text-gray-700">
                                        {t('prediction.land_area')}
                                    </Label>
                                    <Input
                                        id="landArea"
                                        type="number"
                                        placeholder={t('prediction.enter_land_area')}
                                        value={formData.landArea}
                                        onChange={(e) =>
                                            setFormData({ ...formData, landArea: e.target.value })
                                        }
                                        required
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                {/* Soil Type */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700">{t('prediction.soil_type')}</Label>
                                    <select
                                        className="form-input-agri w-full rounded-lg border-gray-300 px-4 py-2.5 bg-white focus:border-primary-500 focus:ring-primary-500"
                                        value={formData.soilType}
                                        onChange={(e) =>
                                            setFormData({ ...formData, soilType: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="" disabled>{t('prediction.select_soil')}</option>
                                        <option value="loamy">{t('prediction.soils.loamy')}</option>
                                        <option value="sandy">{t('prediction.soils.sandy')}</option>
                                        <option value="clayey">{t('prediction.soils.clayey')}</option>
                                        <option value="silty">{t('prediction.soils.silty')}</option>
                                        <option value="peaty">{t('prediction.soils.peaty')}</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full text-lg py-6 mt-4"
                                    disabled={loading}
                                >
                                    {loading ? t('prediction.predicting') : t('prediction.predict_button')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* How to Use Section */}
                {!result && (
                    <div className="max-w-xl mx-auto space-y-4 bg-white/60 p-6 rounded-xl border border-primary-100">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {t('prediction.how_to_use')}
                        </h3>
                        <p className="text-gray-700">
                            {t('prediction.how_to_use_desc')}
                        </p>

                        <ol className="list-decimal list-inside space-y-2 text-gray-800 ml-2">
                            <li>
                                {t('prediction.step_1')}
                            </li>
                            <li>
                                {t('prediction.step_2')}
                            </li>
                            <li>
                                {t('prediction.step_3')}
                            </li>
                            <li>
                                {t('prediction.step_4')}
                            </li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}
