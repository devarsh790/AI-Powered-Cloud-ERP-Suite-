import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-50 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-white" />
                <h3 className="font-medium text-white">AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded transition-colors p-1">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto flex flex-col gap-4 bg-slate-50">
              <div className="bg-blue-50 text-slate-900 text-sm p-3 rounded-lg rounded-tl-none self-start max-w-[85%] border border-blue-200">
                Hello! I'm your Amdox ERP assistant. How can I help you today?
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask a question..." 
                  className="w-full px-4 py-2 pr-10 bg-slate-100 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded text-white hover:bg-blue-700 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
