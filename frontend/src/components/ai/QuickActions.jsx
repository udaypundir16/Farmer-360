import { useTranslation } from 'react-i18next';

export default function QuickActions({ onSelect }) {
  const { t } = useTranslation();

  const actions = [
    { label: t('ai_chat.quick_actions.weather'), query: 'What is the weather forecast for my location?', icon: '🌤️' },
    { label: t('ai_chat.quick_actions.wheat_prices'), query: 'What are the latest crop market prices?', icon: '📊' },
    { label: t('ai_chat.quick_actions.pest_control'), query: 'How to control pests in crops organically?', icon: '🐛' },
    { label: t('ai_chat.quick_actions.pm_kisan'), query: 'Tell me about government agricultural schemes like PM-KISAN', icon: '🎁' },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl mx-auto">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(action.query)}
          className="bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-400 text-sm px-4 py-3 rounded-xl transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex flex-col items-center gap-2"
        >
          <span className="text-2xl">{action.icon}</span>
          <span className="font-medium text-gray-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
}