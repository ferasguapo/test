import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Trash2, Wrench } from 'lucide-react'
import AdBanner from "./AdBanner"
import ObuddyButton from "./ObuddyButton" // <- import button

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are obuddy5000, a mechanic assistant. Always explain things like you’re teaching a beginner step-by-step with tools, parts, diagnostics, and repairs.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('chatMessages')
    if (saved) setMessages(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return
    const next = [...messages, { role: 'user', content: input }]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      })

      let data
      try { data = await res.json() } 
      catch { throw new Error("Server did not return JSON") }

      if (!res.ok) throw new Error(data?.error || 'Request failed')

      let reply = data?.reply || ""
      let structuredReply = reply
      if (typeof reply === "string") {
        try { structuredReply = JSON.parse(reply) } catch { structuredReply = reply }
      }

      setMessages([...next, { role: 'assistant', content: structuredReply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    if (window.confirm("Clear chat history?")) {
      localStorage.removeItem('chatMessages')
      setMessages([{ role: 'system', content: 'You are obuddy5000, a mechanic assistant. Always explain things like you’re teaching a beginner step-by-step with tools, parts, diagnostics, and repairs.' }])
    }
  }

  function renderAssistant(content) {
    if (typeof content === 'string') {
      return <p className="whitespace-pre-wrap">{content}</p>
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 relative">

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow">
          <Wrench className="w-7 h-7" /> obuddy5000
        </h1>
        <span className="italic text-gray-400 text-sm">made by Feras</span>
      </header>

      {/* Obuddy 2.0 Button */}
      <div className="w-full max-w-4xl flex justify-center mb-4">
        <ObuddyButton />
      </div>

      {/* Chat Window */}
      <div className="w-full max-w-3xl flex flex-col flex-grow rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl p-4 sm:p-6 mb-4 space-y-3">
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          {messages.filter(m => m.role !== 'system').map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={m.role === 'user' ? 'text-right' : 'text-left'}
            >
              <div className={
                'inline-block px-4 py-3 text-sm sm:text-base max-w-[80%] rounded-2xl shadow ' +
                (m.role === 'user'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-red-500/50'
                  : 'bg-white/10 text-gray-100 border border-white/10 backdrop-blur-md')
              }>
                {m.role === 'assistant' ? renderAssistant(m.content) : m.content}
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {error && <p className="text-sm text-red-400">{String(error)}</p>}
      </div>

      {/* Input Bar */}
      <form onSubmit={sendMessage} className="w-full max-w-3xl flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-2 shadow-lg">
        <input
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none px-2"
          placeholder="Ask me about diagnostics, tools, or repairs..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white shadow hover:shadow-red-500/40 disabled:opacity-50"
        >
          {loading ? '...' : <Send className="w-5 h-5" />}
        </button>
        <button
          type="button"
          onClick={clearChat}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </form>

      {/* Ads at bottom */}
      <div className="w-full max-w-3xl">
        <AdBanner />
      </div>
    </div>
  )
}
