import { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ChatInput({ onSend, disabled }) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('ai_chat.placeholder') || 'Type your message...'}
        className="flex-1 form-input-agri rounded-agri-lg px-4 py-3 border-primary-100 focus:ring-primary-500/20 bg-white/90"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="p-3 rounded-agri-lg bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-agri hover:shadow-agri-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send size={20} />
      </button>
    </form>
  );
}

