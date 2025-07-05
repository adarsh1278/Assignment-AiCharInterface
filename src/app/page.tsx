'use client'

import React, { useEffect, useRef, useState } from 'react'
import { SendHorizonal, RefreshCw } from 'lucide-react'

type MessageStatus = 'sending' | 'sent' | 'failed'
type Sender = 'user' | 'ai'

interface Message {
  id: string
  message: string
  timestamp: string
  sender: Sender
  status: MessageStatus
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch('/api/chat/history')
      const data = await res.json()
      setMessages(data.messages)
    }
    fetchHistory()
  }, [])

  const sendMessage = async (content: string, retryId?: string) => {
    const userMessage: Message = {
      id: retryId || crypto.randomUUID(),
      message: content,
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'sending'
    }

    if (!retryId) {
      setMessages(prev => [...prev, userMessage])
    } else {
      setMessages(prev =>
        prev.map(m => (m.id === retryId ? { ...m, status: 'sending' } : m))
      )
    }

    setTyping(true)

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        body: JSON.stringify({ message: content, conversationId: 'mock-convo' })
      })

      const aiMessage = await res.json()

      setMessages((prev: any) =>
        prev.map((m: any) =>
          m.id === userMessage.id ? { ...m, status: 'sent' } : m
        ).concat(aiMessage)
      )
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === userMessage.id ? { ...m, status: 'failed' } : m
        )
      )
    } finally {
      setTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map(msg => (
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
                minute: '2-digit'
              })}
              {msg.status === 'sending' && ' • Sending'}
              {msg.status === 'failed' && (
                <button
                  className="text-red-500 ml-2"
                  onClick={() => sendMessage(msg.message, msg.id)}
                  title="Retry"
                >
                  <RefreshCw size={12} />
                </button>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="bg-gray-100 text-gray-600 p-3 rounded-xl max-w-[60%]">
            AI is typing...
          </div>
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
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 p-2 rounded-full text-white">
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  )
}
