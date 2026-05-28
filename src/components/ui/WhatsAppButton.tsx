import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import dataService from '../../services/dataService';

export function WhatsAppButton() {
  const [isOpen, setIsOpen]       = useState(false);
  const [message, setMessage]     = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // ── WhatsApp number from API ──
  const [phoneNumber, setPhoneNumber] = useState<string>(''); 
  // Empty string = button won't function until loaded

  const defaultMessage =
    'Hello CVS Multi Services! I would like to inquire about your services.';

  // ── Fetch WhatsApp number from Links API ──
  useEffect(() => {
    const fetchWhatsApp = async () => {
      try {
        const res = await dataService.getLinks();

        if (res.success && res.data && res.data.length > 0) {
          const linksEntry = res.data[0];

          if (linksEntry.whatsappChat) {
            // Strip "+" and all spaces → "919913991169"
            const cleaned = linksEntry.whatsappChat
              .replace(/\+/g, '')   // remove +
              .replace(/\s/g, '');  // remove spaces
            setPhoneNumber(cleaned);
          }
        }
      } catch (err) {
        console.error('WhatsApp number fetch error:', err);
      }
    };

    fetchWhatsApp();
  }, []);

  // ── Show tooltip after 3s on first visit ──
  useEffect(() => {
    const timer     = setTimeout(() => { if (!isOpen) setShowTooltip(true); }, 3000);
    const hideTimer = setTimeout(() => { setShowTooltip(false); }, 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // ── Close chat on outside click ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ── Send handler ──
  const handleSend = () => {
    // If no number loaded yet, do nothing
    if (!phoneNumber) return;

    const text = encodeURIComponent(message || defaultMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div
      ref={chatRef}
      className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3"
    >
      {/* ── Chat Box ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-[340px] sm:w-[380px] rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(37,211,102,0.1)',
              border: '1px solid rgba(37,211,102,0.2)',
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #075e54, #128c7e)' }}
            >
              <div className="relative">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="w-6 h-6"
                  />
                </div>
                {/* Online indicator */}
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                  style={{ background: '#25d366', border: '2px solid #075e54' }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">CVS Multi Services</h4>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Typically replies within minutes
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           transition-all duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              className="px-5 py-5 min-h-[140px]"
              style={{
                background: '#0b1a2e',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a017' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Welcome Message Bubble */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="max-w-[85%]"
              >
                <div
                  className="rounded-2xl rounded-tl-md px-4 py-3 relative"
                  style={{
                    background: 'rgba(10,36,71,0.8)',
                    border: '1px solid rgba(212,160,23,0.15)',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    👋 Hello! Welcome to{' '}
                    <strong className="text-white">CVS Multi Services</strong>.
                  </p>
                  <p
                    className="text-sm leading-relaxed mt-1"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    How can we help you today? Send us a message and we'll get
                    back to you shortly.
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <span
                      className="text-[10px]"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      {new Date().toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                {/* Tail */}
                <div
                  className="w-3 h-3 ml-1 -mt-1"
                  style={{
                    background: 'rgba(10,36,71,0.8)',
                    clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                    transform: 'rotate(180deg)',
                  }}
                />
              </motion.div>

              {/* Quick action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {['Service Inquiry', 'Get a Quote', 'Project Discussion'].map((quick) => (
                  <button
                    key={quick}
                    onClick={() => setMessage(`Hi, I'm interested in: ${quick}`)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium
                               transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'rgba(212,160,23,0.08)',
                      border: '1px solid rgba(212,160,23,0.2)',
                      color: '#d4a017',
                    }}
                  >
                    {quick}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Input Area */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                background: '#060e1c',
                borderTop: '1px solid rgba(212,160,23,0.1)',
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white
                           placeholder:text-white/30 outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37,211,102,0.4)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              />
              <motion.button
                whileHover={{ scale: phoneNumber ? 1.1 : 1 }}
                whileTap={{ scale: phoneNumber ? 0.9 : 1 }}
                onClick={handleSend}
                // ── Disabled visually if phoneNumber not loaded yet ──
                disabled={!phoneNumber}
                className="w-10 h-10 rounded-xl flex items-center justify-center
                           flex-shrink-0 transition-all duration-300"
                style={{
                  background: phoneNumber
                    ? 'linear-gradient(135deg, #25d366, #128c7e)'
                    : 'rgba(255,255,255,0.1)',
                  boxShadow: phoneNumber
                    ? '0 4px 15px rgba(37,211,102,0.3)'
                    : 'none',
                  cursor: phoneNumber ? 'pointer' : 'not-allowed',
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2 text-center"
              style={{
                background: '#050c18',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                🔒 Powered by WhatsApp · End-to-end encrypted
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tooltip ── */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer"
            style={{
              background: 'rgba(10,36,71,0.95)',
              border: '1px solid rgba(37,211,102,0.3)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => {
              setShowTooltip(false);
              setIsOpen(true);
            }}
          >
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Need help? Chat with us!
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="ml-1"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShowTooltip(false);
          setIsOpen(!isOpen);
        }}
        className="relative w-[60px] h-[60px] rounded-full flex items-center
                   justify-center group"
        style={{
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          boxShadow:
            '0 8px 25px rgba(37,211,102,0.4), 0 0 40px rgba(37,211,102,0.15)',
        }}
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-full"
          style={{ border: '2px solid rgba(37,211,102,0.4)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-7 h-7"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                       flex items-center justify-center"
            style={{
              background: '#d4a017',
              boxShadow: '0 2px 8px rgba(212,160,23,0.5)',
            }}
          >
            <span className="text-[10px] font-bold text-black">1</span>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}