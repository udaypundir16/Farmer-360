import { useTranslation } from 'react-i18next';

const actions = [
  { label: 'Weather for my area', query: 'What is the weather forecast for my location?', icon: '🌤️' },
  { label: 'Wheat prices', query: 'What are the latest wheat prices?', icon: '📊' },
  { label: 'Pest control for tomatoes', query: 'How to control pests in tomato plants?', icon: '🐛' },
  { label: 'PM-KISAN scheme', query: 'Tell me about PM-KISAN scheme', icon: '🎁' },
  { label: 'Crop calendar', query: 'What crops should I plant this month?', icon: '📅' },
  { label: 'Fertilizer advice', query: 'What fertilizers should I use for rice cultivation?', icon: '🌱' },
  { label: 'Market trends', query: 'Show me market trends for cotton', icon: '📈' },
  { label: 'Irrigation tips', query: 'Best irrigation practices for wheat', icon: '💧' },
];

export default function QuickActions({ onSelect }) {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl mx-auto">
      {actions.map((action) => (
        <button
          key={action.label}
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