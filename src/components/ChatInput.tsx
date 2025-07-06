import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled: boolean;
    isLoading: boolean;
}

const ChatInput: React.FC<Props> = ({ value, onChange, onSubmit, disabled, isLoading }) => {
    const handleSubmit = () => {
        if (!disabled && value.trim()) {
            onSubmit();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="p-4">
                <div className="relative flex gap-3 max-w-4xl mx-auto justify-center items-center  ">
                    <div className="flex-1 relative ">
                        <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="w-full p-4 pr-12 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            rows={1}
                            style={{ minHeight: '56px', maxHeight: '200px', height: 'auto' }}
                            disabled={disabled}
                        />
                    </div>
                    <div className=' w-fit h-full mb-2 '>
                        <button
                            onClick={handleSubmit}
                            disabled={disabled || !value.trim()}
                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${disabled || !value.trim()
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ChatInput;
