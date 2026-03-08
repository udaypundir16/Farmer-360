import { User, Bot } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-gold-100'
              : 'bg-white border border-primary-100 text-primary-600'
          }`}
        >
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-agri'
              : 'bg-white border border-primary-100 text-soil shadow-agri'
          }`}
        >
          <span className="text-sm leading-relaxed">{message.content}</span>
        </div>
      </div>
    </div>
  );
}
