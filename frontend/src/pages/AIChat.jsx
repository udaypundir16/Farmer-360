import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/ai.service';
import ChatMessage from '../components/ai/ChatMessage';
import ChatInput from '../components/ai/ChatInput';
import QuickActions from '../components/ai/QuickActions';
import { MessageCircle, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevLengthRef = useRef(0);

  if (!user) {  
    
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
      prevLengthRef.current = parsed.length;
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    if (messages.length > prevLengthRef.current) {
      scrollToBottom();
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendMessage(text);
      const reply = response.reply || response.message || response;
      const aiMessage = {
        role: 'assistant',
        content: typeof reply === 'string' ? reply : JSON.stringify(reply),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      let errorMessage = 'Sorry, I encountered an error. ';
      if (error.response?.status === 401) {
        errorMessage += 'Please log in to use the AI chat feature.';
      } else if (error.response?.status === 429) {
        errorMessage += 'Too many requests. Please wait a moment and try again.';
      } else {
        errorMessage += 'Please try again or check your connection.';
      }
      const errorMsg = { role: 'assistant', content: errorMessage, timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 py-8">
      {/* Very faint crop pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920)' }}
      />
      <div className="container mx-auto p-4 relative z-10">
        <div className="mb-6 flex flex-col items-center animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-agri-lg bg-gradient-to-br from-primary-600 to-primary-700 shadow-agri">
              <Bot size={24} className="text-gold-200" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-800">
                AI Farming Assistant
              </h1>
              <p className="text-soil-light text-center md:text-left">Ask anything about farming, crops, weather & schemes</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-14rem)] max-w-4xl mx-auto rounded-agri-lg shadow-agri-lg bg-white/90 backdrop-blur-sm border border-primary-100 overflow-hidden">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
                <div className="p-4 rounded-full bg-primary-50 border border-primary-100 mb-4">
                  <MessageCircle size={48} className="text-primary-600" />
                </div>
                <p className="text-lg text-soil mb-6 max-w-md font-medium leading-relaxed">
                  Welcome! I'm your AI farming assistant. Ask me anything about farming, crops, weather, or government schemes.
                </p>
                <p className="text-sm text-soil-light mb-4">Click a quick action or type your question</p>
                <QuickActions onSelect={handleSend} />
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className="animate-fade-in-up">
                    <ChatMessage message={msg} />
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-4 py-3 max-w-xs bg-white border border-primary-100 shadow-agri">
                      <div className="flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-typing-dot" />
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-typing-dot animation-delay-200" />
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-typing-dot animation-delay-400" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-primary-100 bg-white/80 backdrop-blur-md p-4">
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
