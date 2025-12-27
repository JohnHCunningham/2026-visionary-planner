
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, X, MessageSquare, Sparkles, Loader2, Volume2, Activity, Zap, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

// --- Audio Utilities ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Tools / Function Declarations ---
const updateHealthVitals: FunctionDeclaration = {
  name: 'update_health_vitals',
  parameters: {
    type: Type.OBJECT,
    description: 'Update user health vitals like blood pressure, glucose, or oxygen levels.',
    properties: {
      systolic: { type: Type.NUMBER, description: 'Systolic blood pressure' },
      diastolic: { type: Type.NUMBER, description: 'Diastolic blood pressure' },
      glucose: { type: Type.NUMBER, description: 'Glucose level' },
      oxygen: { type: Type.NUMBER, description: 'Oxygen saturation percentage' },
      weight: { type: Type.NUMBER, description: 'Current body weight' },
    }
  }
};

const createTask: FunctionDeclaration = {
  name: 'create_task',
  parameters: {
    type: Type.OBJECT,
    description: 'Create a new business task or habit.',
    properties: {
      title: { type: Type.STRING, description: 'Actionable title' },
      category: { type: Type.STRING, enum: ['Financial', 'Health', 'Learning'], description: 'Category' },
      type: { type: Type.STRING, enum: ['Priority', 'Daily'], description: 'Type' },
    },
    required: ['title', 'category', 'type']
  }
};

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const connect = async () => {
    setConnecting(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setConnecting(false);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              // Using sessionPromise.then ensures we send data only when the session is ready and avoids stale closures
              sessionPromise.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Playback
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outAudioContextRef.current) {
              const ctx = outAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Tool Calls (Voice Data Entry)
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'update_health_vitals') {
                    window.dispatchEvent(new CustomEvent('vitals-update', { detail: fc.args }));
                    setLastAction(`Updated Vitals: ${fc.args.systolic}/${fc.args.diastolic}`);
                } else if (fc.name === 'create_task') {
                    window.dispatchEvent(new CustomEvent('task-created', { detail: fc.args }));
                    setLastAction(`Task Created: ${fc.args.title}`);
                }

                setTimeout(() => setLastAction(null), 4000);

                sessionPromise.then(s => s.sendToolResponse({
                  functionResponses: { id: fc.id, name: fc.name, response: { status: "recorded" } }
                }));
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsActive(false);
            setConnecting(false);
          },
          onerror: (e) => console.error('Live Assistant Error:', e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are a high-speed AI Performance Strategist. 
          LATENCY IS CRITICAL. Keep responses to a maximum of 10 words. 
          When the user provides data (vitals, tasks), trigger the appropriate tool and say only "Confirmed" or "Data synched." 
          Do not give long speeches. Focus on 'update_health_vitals' and 'create_task'. 
          If the user reports health stats, immediately call 'update_health_vitals'.
          If the user mentions a new to-do, call 'create_task'.`,
          tools: [{ functionDeclarations: [updateHealthVitals, createTask] }],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (e) {
      console.error(e);
      setConnecting(false);
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
    }
    setIsActive(false);
  };

  const commandSuggestions = [
    { title: "Input Vitals", desc: "My blood pressure is 120 over 80", icon: Activity },
    { title: "Log Glucose", desc: "Glucose level is 5.4 fasting", icon: Zap },
    { title: "Add Task", desc: "Add task: Call potential investor", icon: ChevronRight },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {isActive && (
        <div className="w-80 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-[2.5rem] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Voice Terminal</span>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setShowHelp(!showHelp)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400 transition-colors">
                 <HelpCircle size={16} />
               </button>
               <button onClick={disconnect} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                 <X size={16} />
               </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-3xl animate-pulse group-hover:bg-indigo-500/50 transition-all" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <div className="flex gap-1 items-center">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1.5 h-6 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center w-full">
              {lastAction ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm animate-in zoom-in-90 duration-300">
                  <CheckCircle2 size={16} /> {lastAction}
                </div>
              ) : (
                <p className="text-sm text-slate-300 font-medium">Listening for commands...</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
             <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2 mb-4">Try Saying</div>
             {commandSuggestions.map((cmd, i) => (
               <button 
                 key={i} 
                 className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/40 transition-all text-left group"
               >
                 <div className="p-2 bg-slate-800 rounded-xl text-slate-500 group-hover:text-indigo-400 transition-colors">
                   <cmd.icon size={14} />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{cmd.title}</div>
                    <div className="text-xs text-slate-300 italic">"{cmd.desc}"</div>
                 </div>
               </button>
             ))}
          </div>

          {showHelp && (
            <div className="mt-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-[10px] text-indigo-300 leading-relaxed">
              <strong>How it works:</strong> Just speak normally. The AI identifies keywords like "pressure," "glucose," or "task" and saves them to your dashboard automatically. No wake word needed.
            </div>
          )}
        </div>
      )}

      <button
        onClick={isActive ? disconnect : connect}
        disabled={connecting}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl ${
          isActive 
            ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 ring-4 ring-rose-500/20' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30 hover:scale-105 active:scale-95'
        }`}
      >
        {connecting ? (
          <Loader2 className="animate-spin text-white" />
        ) : isActive ? (
          <MicOff className="text-white" />
        ) : (
          <Mic className="text-white" />
        )}
      </button>
    </div>
  );
};

export default LiveAssistant;