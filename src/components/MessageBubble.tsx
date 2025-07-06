import React, { useState } from 'react';
import { User, Bot, Sparkles, Check, Copy, Edit3, X, Loader2 } from 'lucide-react';
import type { Message } from '../../store/reducers/chatReducer';

interface Props {
    message: Message;
    onCopy: (text: string) => void;
    onEdit: (id: string) => void;
    isEditing: boolean;
    editValue: string;
    onEditChange: (value: string) => void;
    onEditSave: () => void;
    onEditCancel: () => void;
    isTyping?: boolean;
}

const MessageBubble: React.FC<Props> = ({
    message,
    onCopy,
    onEdit,
    isEditing,
    editValue,
    onEditChange,
    onEditSave,
    onEditCancel,
    isTyping = false,
}) => {
    const [copied, setCopied] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const isUser = message.sender === 'user';
    const isLoading = message.status === 'sending';

    const handleCopy = () => {
        onCopy(message.message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`group relative flex items-start gap-3 p-6 rounded-2xl transition-all duration-300 hover:bg-slate-50/50 ${isUser ? 'flex-row-reverse' : ''}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}>
                {isUser ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Message Content */}
            <div className={`flex-1 relative ${isUser ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[85%] ${isUser ? 'ml-auto' : ''}`}>
                    {/* Message Header */}
                    <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : ''}`}>
                        <span className="text-sm font-medium text-slate-700">
                            {isUser ? 'You' : 'AI Assistant'}
                        </span>
                        {!isUser && !isLoading && !isTyping && (
                            <Sparkles size={14} className="text-emerald-500" />
                        )}
                    </div>

                    {/* Message Bubble */}
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                value={editValue}
                                onChange={(e) => onEditChange(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={onEditSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <Check size={16} />
                                    Save & Continue
                                </button>
                                <button
                                    onClick={onEditCancel}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`relative p-4 rounded-xl shadow-sm border transition-all duration-300 ${isUser
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-200'
                            : 'bg-white border-slate-200 text-slate-800'
                            }`}>
                            {/* Action buttons at top corner of bubble */}
                            {!isEditing && showActions && !isLoading && !isTyping && (
                                <div
                                    className={`
    absolute top-2
    ${isUser ? 'left-1    mt-10 flex-row-reverse' : 'right-1 mt-9'}
    flex gap-1 z-10 items-center
  `}
                                >

                                    <button
                                        onClick={handleCopy}
                                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                                        title="Copy message"
                                    >
                                        {copied ? (
                                            <Check size={14} className="text-green-500" />
                                        ) : (
                                            <Copy size={14} className="text-slate-600" />
                                        )}
                                    </button>
                                    {isUser && (
                                        <button
                                            onClick={() => onEdit(message.id)}
                                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                                            title="Edit message and continue conversation"
                                        >
                                            <Edit3 size={14} className="text-slate-600" />
                                        </button>
                                    )}
                                </div>
                            )}
                            {/* Message content */}
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">
                                        {isLoading ? 'Sending...' : 'Thinking...'}
                                    </span>
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap break-words">
                                    {message.message}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timestamp & Status */}
                    <div className={`flex  gap-2 mt-2 text-xs text-slate-500 ${isUser ? 'justify-end  ' : ''}`}>
                        <span>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                        {message.status === 'failed' && (
                            <span className="text-red-500">Failed</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
