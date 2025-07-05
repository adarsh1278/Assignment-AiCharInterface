import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { message } = await request.json()
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

  const aiResponses = [
    "That's an interesting question! Let me think about it...",
    "I understand what you're asking. Here's my perspective:",
    "Based on what you've shared, I would suggest:",
    "That's a great point. Here are some thoughts:"
  ]

  const aiResponse = {
    id: crypto.randomUUID(),
    message:
      aiResponses[Math.floor(Math.random() * aiResponses.length)] +
      ` (Replying to: "${message.slice(0, 50)}...")`,
    timestamp: new Date().toISOString(),
    sender: 'ai' as const,
    status: 'sent' as const
  }

  return NextResponse.json(aiResponse)
}
