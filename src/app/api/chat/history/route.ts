import { NextResponse } from 'next/server'

export async function GET() {
  const mockHistory = [
    {
      id: '1',
      message: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      sender: 'ai',
      status: 'sent'
    }
  ]

  return NextResponse.json({
    messages: mockHistory,
    conversationId: crypto.randomUUID()
  })
}
