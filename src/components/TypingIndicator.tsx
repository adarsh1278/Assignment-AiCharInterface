import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const TypingIndicator: React.FC = () => (
    <div className="flex items-start gap-3 p-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center">
            <Bot size={18} />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-700">AI Assistant</span>
                <Sparkles size={14} className="text-emerald-500" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0s]"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="text-sm text-slate-600 ml-2">AI is typing...</span>
                </div>
            </div>
        </div>
    </div>
);

export default TypingIndicator;
