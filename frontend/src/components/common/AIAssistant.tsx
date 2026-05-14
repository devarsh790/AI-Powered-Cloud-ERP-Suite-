import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Zap } from 'lucide-react';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am Receptionist Anni. I have synchronized the latest signals from finance, HR, and supply chain. Ask me for forecasts, exceptions, or workflow recommendations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');

    // Add user message
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I'm analyzing your request.";
      const lower = userMessage.toLowerCase();

      if (lower.includes('cash flow') || lower.includes('finance')) {
        aiResponse = "Based on our current receivables, cash flow looks stable for the next 30 days. We have ₹1.45 Cr in net operating value and 5 pending high-value invoices expected to clear next week.";
      } else if (lower.includes('workforce') || lower.includes('hr') || lower.includes('people')) {
        aiResponse = "We currently have 1240 people available across departments. There are 3 active leave requests in the HR queue that need your approval.";
      } else if (lower.includes('inventory') || lower.includes('supply') || lower.includes('stock')) {
        aiResponse = "Inventory coverage is healthy at 28.4 days. However, 'UPS Battery Pack' and 'LED Monitor 27\"' are running low in stock. I recommend initiating a purchase order for these SKUs.";
      } else if (lower.includes('project') || lower.includes('portfolio')) {
        aiResponse = "We have 6 active projects. 'Cloud Migration' is running slightly over budget (+3.5M actual vs planned), while 'Data Lake Platform' is well within margin and 88% complete.";
      } else {
        aiResponse = "I'm checking the ERP modules for that information. As Receptionist Anni, I can help you with finance projections, HR analytics, inventory risks, and project tracking. What would you like to explore?";
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: aiResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1000);
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open Receptionist Anni"
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          zIndex: 100,
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, var(--primary) 0%, #1d4ed8 72%, var(--accent-cyan) 140%)',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 34px var(--primary-glow)',
          cursor: 'pointer',
          padding: 0,
          overflow: 'hidden'
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/anni_avatar.png"
          alt="Anni"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Anni&background=0D8ABC&color=fff&size=64';
          }}
        />

        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '2px solid rgba(37, 99, 235, 0.34)',
            pointerEvents: 'none',
          }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel"
            style={{
              position: 'fixed',
              bottom: '6.5rem',
              right: '1.75rem',
              zIndex: 100,
              width: 'min(450px, calc(100vw - 2rem))',
              height: 560,
              maxHeight: 'calc(100vh - 7rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.95)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/anni_avatar.png"
                    alt="Anni"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Anni&background=0D8ABC&color=fff&size=64';
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                    Receptionist Anni
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--success)',
                        boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)',
                      }}
                    />
                    <span className="label-overline" style={{ letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                      Online & Ready
                    </span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="btn-icon" aria-label="Close assistant" style={{ background: 'transparent', border: 'none' }}>
                <X size={20} color="var(--text-secondary)" />
              </button>
            </div>

            {/* Chat Area */}
            <div
              style={{
                flex: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                background: 'var(--bg-surface)',
              }}
            >
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  {msg.role === 'assistant' && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src="/anni_avatar.png"
                        alt="Anni"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Anni&background=0D8ABC&color=fff&size=64';
                        }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div
                      className={msg.role === 'assistant' ? 'glass-card' : ''}
                      style={{
                        padding: '0.85rem 1.125rem',
                        borderRadius: 12,
                        borderTopLeftRadius: msg.role === 'assistant' ? 4 : 12,
                        borderTopRightRadius: msg.role === 'user' ? 4 : 12,
                        fontSize: '0.9rem',
                        color: msg.role === 'user' ? '#fff' : 'var(--text-secondary)',
                        background: msg.role === 'user' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.4)',
                        lineHeight: 1.55,
                        boxShadow: msg.role === 'user' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                      }}
                    >
                      {msg.content}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: 4 }}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {chatHistory.length === 1 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '1rem', justifyContent: 'center' }}>
                  {['Cash flow outlook', 'Workforce risk', 'Inventory coverage'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setMessage(chip);
                      }}
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: 20 }}
                    >
                      <Zap size={12} color="var(--accent-cyan)" />
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-light)', background: 'var(--surface-muted)' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Ask Anni about KPIs, approvals, or anomalies..."
                  className="input"
                  style={{
                    paddingRight: '3.5rem',
                    height: 52,
                    borderRadius: 26,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)'
                  }}
                />
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  style={{
                    position: 'absolute',
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: message.trim() ? 'var(--primary)' : 'var(--border-light)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: message.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: message.trim() ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
                  }}
                >
                  <Send size={16} color={message.trim() ? "#fff" : "var(--text-dim)"} style={{ marginLeft: -2 }} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: '0.75rem' }}>
                <Sparkles size={12} color="var(--text-dim)" />
                <p
                  className="label-overline"
                  style={{ color: 'var(--text-dim)', letterSpacing: '0.05em', fontSize: '0.65rem' }}
                >
                  Amdox AI Assistant
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

