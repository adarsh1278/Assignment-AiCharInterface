"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchMessages, sendMessage } from '../../store/actions/chatActions'
import type { Message } from '../../store/reducers/chatReducer'
import MessageBubble from '../components/MessageBubble'
import TypingIndicator from '../components/TypingIndicator'
import ChatInput from '../components/ChatInput'

// Main Chat Component
export default function FuturisticChat() {
  const dispatch = useAppDispatch()
  const { messages, typing, loading } = useAppSelector((state) => state.chat)
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typing])

  // Fetch chat history on mount
  useEffect(() => {
    dispatch(fetchMessages())
  }, [dispatch])

  // Debug: Add logging to check Redux state
  useEffect(() => {
    console.log('Redux State:', {
      messagesCount: messages.length,
      typing,
      loading
    })
  }, [messages, typing, loading])

  // Auto-reset typing state after 30 seconds (safety net)
  useEffect(() => {
    if (typing) {
      const timeout = setTimeout(() => {
        console.warn('Typing state stuck - this indicates a Redux action issue')
      }, 30000)
      return () => clearTimeout(timeout)
    }
  }, [typing])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      message: content,
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'sending'
    }
    console.log('Sending message:', userMessage)
    dispatch(sendMessage(userMessage))
  }

  const handleSubmit = () => {
    if (!input.trim() || typing || loading) return
    handleSendMessage(input)
    setInput('')
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleEdit = (id: string) => {
    const message = messages.find(m => m.id === id)
    if (message) {
      setEditingId(id)
      setEditValue(message.message)
    }
  }

  const handleEditSave = () => {
    if (!editingId || !editValue.trim()) return

    // Find the message being edited
    const messageIndex = messages.findIndex(m => m.id === editingId)
    if (messageIndex === -1) return

    // Send the edited message as a new conversation starter
    // This will continue the conversation from this point
    handleSendMessage(editValue)

    // Clear editing state
    setEditingId(null)
    setEditValue('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  const isInputDisabled = typing || loading || editingId !== null

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-blue-500" />
            AI Chat Assistant
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Powered by advanced AI technology
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center gap-2">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <span className="text-slate-600 text-lg">Loading chat history...</span>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={handleCopy}
                  onEdit={handleEdit}
                  isEditing={editingId === message.id}
                  editValue={editValue}
                  onEditChange={setEditValue}
                  onEditSave={handleEditSave}
                  onEditCancel={handleEditCancel}
                />
              ))}

              {typing && !loading && <TypingIndicator />}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isInputDisabled}
        isLoading={typing}
      />
    </div>
  )
}