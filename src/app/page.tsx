'use client'

import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonal, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMessages, sendMessage } from '../../store/actions/chatActions';
import type { Message } from '../../store/reducers/chatReducer';

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { messages, typing, loading } = useAppSelector((state) => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history on mount
  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  const handleSendMessage = async (content: string, retryId?: string) => {
    const userMessage: Message = {
      id: retryId || crypto.randomUUID(),
      message: content,
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'sending',
    };
    dispatch(sendMessage(userMessage));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500 animate-pulse">Loading chat history...</span>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[75%] p-3 rounded-xl relative whitespace-pre-wrap break-words ${msg.sender === 'user'
                  ? 'bg-blue-500 text-white self-end ml-auto'
                  : 'bg-gray-200 text-black self-start'
                  }`}
              >
                {msg.message}
                <div className="text-xs mt-1 text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {msg.status === 'sending' && ' • Sending'}
                  {msg.status === 'failed' && (
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => handleSendMessage(msg.message, msg.id)}
                      title="Retry"
                    >
                      <RefreshCw size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {typing && !loading && (
              <div className="bg-gray-100 text-gray-600 p-3 rounded-xl max-w-[60%] flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]"></span>
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2">AI is typing...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex border-t p-2 items-center gap-2 bg-white"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={typing || loading}
        />
        <button
          type="submit"
          className="bg-blue-500 p-2 rounded-full text-white disabled:opacity-50"
          disabled={typing || loading || !input.trim()}
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}
