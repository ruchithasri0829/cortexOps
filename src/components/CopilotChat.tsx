import { useState, useEffect, useRef, useCallback } from 'react';
import { useUiStore } from '../store/uiStore';
import { Send, Bot, X, Mic, Activity, ChevronRight, CheckCircle2, AlertTriangle, Cpu, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function CopilotChat() {
  const { 
    copilotOpen, setCopilotOpen, isEmergency, 
    setActiveTab, setEmergency, setFocusedAssetId, toggleEmergency, t 
  } = useUiStore();
  
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string, type?: 'text' | 'analysis' | 'action'}[]>([
    { role: 'bot', text: 'CortexOps Industrial AI initialized. Plant telemetry is nominal. Voice systems online. How can I assist you?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emergencyMessageAddedRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition if supported
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.9;
    
    // Try to find a good robotic/female voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.name.includes('Microsoft Hazel'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (isEmergency && copilotOpen && !emergencyMessageAddedRef.current) {
      setMessages(prev => [
        ...prev, 
        { role: 'bot', text: 'CRITICAL EVENT DETECTED: Analyzing cascade failure signature...', type: 'text' },
        { role: 'bot', text: 'Cooling Pump seal failure highly probable (94.2% confidence). Recommend immediate isolation of V-204 and engaging redundant pump A2-B.', type: 'analysis' }
      ]);
      speakText('Critical event detected. Cooling Pump seal failure highly probable. Recommend immediate isolation.');
      emergencyMessageAddedRef.current = true;
    } else if (!isEmergency) {
      emergencyMessageAddedRef.current = false;
    }
  }, [isEmergency, copilotOpen, speakText]);

  const getSuggestions = () => {
    return [
      "Show critical alarms",
      "Activate emergency mode",
      "Display pump diagnostics",
      "Show maintenance trends",
      "Open builder mode"
    ];
  };

  const handleSend = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      let reply = "Processing telemetry data...";
      let type: 'text' | 'analysis' | 'action' = 'text';

      const lowerText = text.toLowerCase();
      
      // Execute voice commands
      if (lowerText.includes("emergency mode") || lowerText.includes("simulate incident")) {
        setEmergency(true);
        reply = "Emergency mode activated. Initiating plant-wide critical alerts and containment protocols.";
        type = 'action';
      } else if (lowerText.includes("alarms") || lowerText.includes("alerts")) {
        setActiveTab('alerts');
        reply = "Displaying active system alarms. I have highlighted the most critical events.";
      } else if (lowerText.includes("builder") || lowerText.includes("hmi")) {
        setActiveTab('builder');
        reply = "HMI Builder mode opened. You can now configure the plant overview dashboard.";
      } else if (lowerText.includes("trend") || lowerText.includes("analytics")) {
        setActiveTab('analytics');
        reply = "Loading maintenance trends and historical analytics for current operational cycle.";
      } else if (lowerText.includes("pump") || lowerText.includes("diagnostic")) {
        setFocusedAssetId('pump');
        reply = "Pump A2 diagnostics loaded. Vibration analysis shows a rising 1x RPM harmonic, indicating potential rotor imbalance. I recommend scheduling an inspection within 48 hours.";
        type = 'analysis';
      } else if (lowerText.includes("cause") || lowerText.includes("diagnose")) {
        reply = "Root Cause Analysis: Pump cavitation resulted from a transient pressure drop in the intake line. The sudden vapor bubble collapse caused mechanical shock, fracturing the primary seal.";
        type = 'analysis';
      } else if (lowerText.includes("step") || lowerText.includes("action") || lowerText.includes("isolate")) {
        reply = "Guided Action Plan generated. Awaiting operator confirmation to execute valve isolation sequence.";
        type = 'action';
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply, type }]);
      speakText(reply);
    }, 1200);
  }, [isTyping, isListening, setEmergency, setActiveTab, setFocusedAssetId, speakText]);

  // Handle listening stop/start via effect when input changes from voice
  useEffect(() => {
    if (isListening && input && !recognitionRef.current) {
      // Simulation mode fallback
      const timer = setTimeout(() => {
         handleSend(input);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [input, isListening, handleSend]);


  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      if (input.trim()) handleSend(input);
    } else {
      setInput('');
      setIsListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Speech recognition error:", e);
          setIsListening(false);
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          setInput("Show critical alarms");
          setTimeout(() => {
            setIsListening(false);
            handleSend("Show critical alarms");
          }, 1500);
        }, 1000);
      }
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!copilotOpen) {
    return (
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCopilotOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 transition-all duration-500 border ${
          isEmergency 
            ? 'bg-cortex-danger/20 border-cortex-danger text-cortex-danger' 
            : 'bg-black/80 border-cortex-accent/30 text-cortex-accent hover:border-cortex-accent hover:shadow-[0_0_30px_var(--color-cortex-accent-glow)]'
        }`}
      >
        <div className="relative">
           {isEmergency && <div className="absolute inset-0 rounded-full border-2 border-cortex-danger animate-ping"></div>}
           <Bot size={28} className={isEmergency ? "animate-pulse" : ""} />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-48px)] glass-panel border ${isEmergency ? 'border-cortex-danger/50 shadow-[0_0_40px_rgba(255,23,68,0.2)]' : 'border-white/10 shadow-2xl'} z-50 flex flex-col overflow-hidden`}
      style={{ height: '600px' }}
    >
      <div className={`p-4 border-b flex justify-between items-center bg-black/40 backdrop-blur-md relative overflow-hidden ${isEmergency ? 'border-cortex-danger/30' : 'border-white/5'}`}>
        {isEmergency && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cortex-danger/20 to-transparent pointer-events-none"></div>}
        <div className="flex items-center gap-3 relative z-10">
          <div className={`p-2 rounded-lg ${isEmergency ? 'bg-cortex-danger/20 text-cortex-danger' : 'bg-cortex-accent/10 text-cortex-accent'} relative`}>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEmergency ? 'bg-cortex-danger' : 'bg-cortex-accent'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isEmergency ? 'bg-cortex-danger' : 'bg-cortex-accent'}`}></span>
              </span>
            )}
            <Cpu size={20} className={isSpeaking ? "animate-pulse" : ""} />
          </div>
          <div>
             <span className="font-bold text-sm tracking-[0.2em] uppercase text-white flex items-center gap-2">
               Cortex<span className={isEmergency ? 'text-cortex-danger' : 'text-cortex-accent'}>AI</span>
               {isSpeaking && <Volume2 size={14} className={`animate-pulse ${isEmergency ? 'text-cortex-danger' : 'text-cortex-accent'}`} />}
             </span>
             <span className="text-[9px] font-mono uppercase tracking-widest text-cortex-text-muted">
               {isListening ? 'Awaiting Voice Command...' : isSpeaking ? 'Transmitting Audio...' : 'Industrial Copilot Active'}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          {isSpeaking && (
            <button onClick={stopSpeaking} className="text-cortex-text-muted hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all" title="Mute AI">
              <X size={14} />
            </button>
          )}
          <button onClick={() => setCopilotOpen(false)} className="text-cortex-text-muted hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 flex flex-col custom-scrollbar relative">
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-white)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.02] pointer-events-none"></div>
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${m.role === 'user' ? '' : 'group'}`}>
               {m.role === 'bot' && (
                 <div className="flex items-center gap-2 mb-1.5 ml-1 opacity-50">
                    <Bot size={12} className={isEmergency ? "text-cortex-danger" : "text-cortex-accent"} />
                    <span className="text-[9px] uppercase tracking-widest font-bold">System</span>
                 </div>
               )}
               
               {m.type === 'analysis' ? (
                 <div className={`p-4 rounded-xl border ${isEmergency ? 'bg-cortex-danger/10 border-cortex-danger/30' : 'bg-cortex-accent/5 border-cortex-accent/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       {isEmergency ? <AlertTriangle size={14} className="text-cortex-danger" /> : <Activity size={14} className="text-cortex-accent" />}
                       <span className={`text-[10px] uppercase font-bold tracking-[0.2em] ${isEmergency ? 'text-cortex-danger' : 'text-cortex-accent'}`}>Diagnostic Insight</span>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{m.text}</p>
                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                       <span className="text-[9px] text-cortex-text-muted font-mono">CONFIDENCE: 94%</span>
                       <button className="text-[10px] font-bold text-white hover:underline flex items-center">View Details <ChevronRight size={12}/></button>
                    </div>
                 </div>
               ) : m.type === 'action' ? (
                 <div className="p-4 rounded-xl border border-cortex-success/30 bg-cortex-success/10">
                    <div className="flex items-center gap-2 mb-2">
                       <CheckCircle2 size={14} className="text-cortex-success" />
                       <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-cortex-success">Action Recommended</span>
                    </div>
                    <p className="text-sm text-white mb-4">{m.text}</p>
                    <button 
                      onClick={() => {
                         if (m.text.includes("emergency") || m.text.includes("Emergency")) {
                            toggleEmergency();
                         }
                         setCopilotOpen(false);
                      }}
                      className="w-full py-2 bg-cortex-success/20 hover:bg-cortex-success/30 text-cortex-success border border-cortex-success/50 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                       Execute Procedure
                    </button>
                 </div>
               ) : (
                 <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                   m.role === 'user' 
                     ? 'bg-cortex-accent text-black font-medium rounded-tr-sm' 
                     : 'bg-black/40 border border-white/10 text-slate-200 rounded-tl-sm'
                 }`}>
                   {m.text}
                 </div>
               )}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-cortex-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-cortex-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-cortex-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/5 relative z-10">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 custom-scrollbar hide-scrollbar">
          {getSuggestions().map((s, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(s)}
              className="whitespace-nowrap text-[11px] font-medium tracking-wide bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-cortex-text hover:text-white transition-all hover:border-cortex-accent/30"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-end">
          <div className={`flex-1 bg-black/40 border rounded-xl flex items-center p-1 transition-all ${isListening ? 'border-cortex-accent/50 ring-1 ring-cortex-accent/50' : 'border-white/10 focus-within:border-cortex-accent/50 focus-within:ring-1 focus-within:ring-cortex-accent/50'}`}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder={isListening ? t('awaitingCommand') : t('askCortex')}
              className="w-full bg-transparent border-none px-4 py-3 text-sm text-white placeholder:text-cortex-text-muted focus:outline-none focus:ring-0"
            />
            {isListening && (
              <div className="flex items-center gap-1 pr-4">
                 <motion.span animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-cortex-accent rounded-full"></motion.span>
                 <motion.span animate={{ height: [16, 8, 16] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-cortex-accent rounded-full"></motion.span>
                 <motion.span animate={{ height: [8, 20, 8] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-cortex-accent rounded-full"></motion.span>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleListening}
            className={`p-3.5 rounded-xl border transition-all duration-300 flex-shrink-0 ${
              isListening 
                ? 'bg-cortex-accent/20 border-cortex-accent text-cortex-accent shadow-[0_0_15px_var(--color-cortex-accent-glow)]' 
                : 'bg-white/5 border-white/10 text-cortex-text-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Mic size={18} className={isListening ? "animate-pulse" : ""} />
          </button>

          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className={`p-3.5 rounded-xl transition-all duration-300 flex-shrink-0 ${
              input.trim() && !isTyping
                ? 'bg-cortex-accent text-black hover:bg-white shadow-[0_0_15px_var(--color-cortex-accent-glow)]' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
