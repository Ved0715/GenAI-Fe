"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, ArrowLeft, Menu, Edit, Plus, Trash2, Share } from "lucide-react"
import Link from "next/link"

interface User {
  id?: string
  name?: string
  email?: string
}

interface ChatProps {
  userId: string
  currentUser: User | null
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export function Chat({ userId, currentUser }: ChatProps) {
  // Add custom styles to prevent weird focus boxes
  const chatStyles = `
    .chat-textarea:focus {
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
      ring: none !important;
    }
    .chat-button:focus {
      outline: none !important;
      box-shadow: none !important;
      ring: none !important;
    }
  `
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsLoading(true)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for your message! This is a simulated AI response. In a real implementation, this would connect to an AI service like OpenAI.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  const conversationHistory = [
    "Web development best practices",
    "React vs Vue comparison",
    "Database optimization tips",
    "API design patterns"
  ]

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      <style>{chatStyles}</style>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h1 className="text-lg font-semibold">AI Chat</h1>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          // Welcome Screen - ChatGPT Style
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground mb-8">
                I'm your AI assistant. Ask me anything!
              </p>

              {/* Example prompts */}
              <div className="grid gap-3 sm:grid-cols-2 max-w-lg mx-auto">
                {[
                  "Explain quantum computing",
                  "Write a Python function",
                  "Plan a marketing strategy",
                  "Create a workout routine"
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMessage(prompt)}
                    className="p-3 text-left rounded-lg border bg-card hover:bg-muted transition-colors text-sm"
                  >
                    <div className="font-medium">{prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Messages List
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div key={message.id} className="flex gap-4">
                <Avatar className="h-8 w-8 mt-1">
                  {message.sender === 'ai' ? (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src="" alt={currentUser?.name || 'User'} />
                      <AvatarFallback>
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1">
                    {message.sender === 'ai' ? 'AI Assistant' : currentUser?.name || 'You'}
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1">AI Assistant</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-muted rounded-2xl p-3 border-0" style={{ outline: 'none' }}>
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              placeholder="Message AI Assistant..."
              disabled={isLoading}
              className="chat-textarea flex-1 resize-none bg-transparent border-0 focus:outline-none focus:ring-0 focus:border-0 max-h-[200px] min-h-[20px] placeholder:text-muted-foreground outline-none ring-0"
              rows={1}
              style={{ outline: 'none', boxShadow: 'none' }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim()}
              size="sm"
              className="chat-button rounded-xl shrink-0 focus:outline-none focus:ring-0 hover:scale-105 transition-transform"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}