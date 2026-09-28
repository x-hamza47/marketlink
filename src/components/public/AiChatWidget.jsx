import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  HelpCircle,
  Minimize2,
} from 'lucide-react'
import axiosClient from '@/services/axiosClient'
import clsx from 'clsx'

const SUGGESTED_PROMPTS = [
  'What markets are open this weekend?',
  'How does pre-order pickup work?',
  'Are products organic and fresh?',
  'How do I contact a local farmer?',
]

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your MarketLink AI Assistant. Ask me about nearby markets, available seasonal produce, or how to place orders for pickup.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim()
    if (!query || loading) return

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await axiosClient.post('/ai/chat', {
        message: query,
        context: 'MarketLink is an eGreen Basket local farmers market platform connecting customers with farmers for market pickup.',
      })

      const botReply = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: data?.data?.reply || data?.reply || "I'm here to help with all your market and product questions.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botReply])
    } catch (err) {
      const errorReply = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: "I'm having a little trouble connecting right now. You can also explore products directly on our Products page!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorReply])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-96 rounded-3xl border border-line bg-surface-cream shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[80vh] transition-all animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-forest text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
                <Bot size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight flex items-center gap-1.5">
                  MarketLink Assistant
                  <Sparkles size={13} className="text-amber-300" />
                </p>
                <p className="text-[11px] text-white/80">Ask about produce, markets & pickup</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-ivory/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={clsx(
                  'flex gap-2.5 max-w-[85%]',
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <span
                  className={clsx(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    m.sender === 'user'
                      ? 'bg-forest text-white'
                      : 'bg-forest/10 text-forest'
                  )}
                >
                  {m.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
                </span>

                <div>
                  <div
                    className={clsx(
                      'rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm',
                      m.sender === 'user'
                        ? 'bg-forest text-white rounded-tr-none'
                        : 'bg-surface-cream border border-line text-text-main rounded-tl-none'
                    )}
                  >
                    {m.text}
                  </div>
                  <p
                    className={clsx(
                      'text-[9px] text-text-secondary/70 mt-1 px-1',
                      m.sender === 'user' ? 'text-right' : 'text-left'
                    )}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 mr-auto items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <Bot size={13} />
                </span>
                <div className="rounded-2xl rounded-tl-none bg-surface-cream border border-line px-3.5 py-2.5 shadow-sm flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-forest animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-forest animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length < 3 && !loading && (
            <div className="px-3 py-2 bg-surface-cream border-t border-line overflow-x-auto flex gap-1.5 scrollbar-hide">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 rounded-full border border-line bg-bg-ivory px-2.5 py-1 text-[11px] text-text-secondary hover:text-forest hover:border-forest transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-surface-cream border-t border-line flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about MarketLink…"
              disabled={loading}
              className="flex-1 rounded-full border border-line bg-bg-ivory px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-forest"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white hover:bg-forest-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-full bg-forest px-4 py-3 text-white shadow-xl hover:bg-forest-dark hover:scale-105 active:scale-95 transition-all group"
        aria-label="Toggle AI Assistant"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <Bot size={22} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span className="text-sm font-semibold tracking-wide pr-1 hidden sm:inline">
          Ask AI
        </span>
      </button>
    </div>
  )
}
