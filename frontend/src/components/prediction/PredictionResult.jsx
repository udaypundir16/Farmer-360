import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Check, ArrowLeft, Sprout, Droplets, Bug } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PredictionResult({ result, onBack }) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-primary-100 shadow-agri-lg overflow-hidden">
                <CardHeader className="bg-primary-50 border-b border-primary-100">
                    <CardTitle className="text-2xl text-primary-800 flex items-center gap-2">
                        <Sprout className="text-green-600" />
                        {t('prediction.result_title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-primary-50 rounded-xl border border-primary-100">
                        <h3 className="text-lg font-medium text-gray-600 mb-2">{t('prediction.predicted_yield')}</h3>
                        <p className="text-4xl font-bold text-primary-700">{result.predictedYield}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            {t('prediction.recommendations')}
                        </h3>
                        <div className="grid gap-3">
                            {result.recommendations.map((rec, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm"
                                >
                                    <div className="mt-1 min-w-[20px]">
                                        {index === 0 ? <Droplets size={18} className="text-blue-500" /> :
                                            index === 2 ? <Bug size={18} className="text-red-500" /> :
                                                <Sprout size={18} className="text-green-500" />}
                                    </div>
                                    <p className="text-gray-700">{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button
                onClick={onBack}
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
            >
                <ArrowLeft size={16} />
                {t('prediction.go_back')}
            </Button>
        </div>
    );
}
