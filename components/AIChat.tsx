import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Transaction, ChatMessage } from '../types';
import { createFinancialChat, sendMessageToAdvisor } from '../services/geminiService';
import { Chat } from '@google/genai';
import Tooltip from './ui/Tooltip';

interface AIChatProps {
  transactions: Transaction[];
}

const AIChat: React.FC<AIChatProps> = ({ transactions }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm TrustBot. I can analyze your spending, help you budget, or search for specific transaction details. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session once
  useEffect(() => {
    if (!chatInstance.current) {
      chatInstance.current = createFinancialChat(transactions);
    }
  }, [transactions]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatInstance.current || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAdvisor(chatInstance.current, userMsg.text);
      
      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide">TrustBot Advisor</h2>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[80%] md:max-w-[70%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-orange-600 border-orange-500' : 'bg-slate-800 border-slate-700'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-orange-500" />}
              </div>
              
              <div 
                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}
              >
                 {/* Simple markdown parser for bolding */}
                 <div dangerouslySetInnerHTML={{ 
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') 
                 }} />
                 <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-orange-200' : 'text-slate-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700 shadow-sm ml-10">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Analyzing wealth data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your portfolio, e.g., 'How much did I spend on travel?'"
            className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-slate-900 transition-all outline-none text-white placeholder-slate-500"
          />
          <Tooltip content="Send Message" position="top">
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">
          TrustBot may make mistakes. Please check important info.
        </p>
      </div>
    </div>
  );
};

export default AIChat;