
import React, { useState } from 'react';
import { 
  FileText, Calendar, TrendingUp, AlertCircle, ChevronRight, 
  Sparkles, Loader2, Download, Printer, ShieldCheck, Zap,
  BarChart, Target, BrainCircuit, ArrowRight
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { StrategicReport } from '../types';

const ReportingView: React.FC = () => {
  const [horizon, setHorizon] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<StrategicReport | null>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate a 2026 Strategic ${horizon} Report. 
        Context: The user is building a $250,000/year AI Revenue Factory while optimizing vitals (BP, Glucose).
        Focus on the synergy between execution (Tier A tasks) and physiological state.
        Be blunt, executive, and highly strategic.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              businessHealthScore: { type: Type.NUMBER },
              physicalHealthScore: { type: Type.NUMBER },
              primaryBlocker: { type: Type.STRING },
              tacticalDirectives: { type: Type.ARRAY, items: { type: Type.STRING } },
              revenueForecast: { type: Type.STRING },
            },
            required: ["executiveSummary", "businessHealthScore", "physicalHealthScore", "primaryBlocker", "tacticalDirectives", "revenueForecast"]
          }
        }
      });
      
      const data = JSON.parse(response.text || '{}');
      setReport({
        ...data,
        timestamp: new Date().toLocaleString(),
        horizon: horizon
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Strategic Intelligence</h1>
          <p className="text-slate-400 font-medium">Automated Multi-Horizon Execution Briefings</p>
        </div>
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${horizon === h ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {!report && !isGenerating && (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-16 text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20">
            <FileText size={40} />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold">Initiate {horizon} Analysis</h2>
            <p className="text-slate-400 mt-2">Our strategic core will synthesize your Revenue Factory metrics and Bio-data into a comprehensive success forecast.</p>
          </div>
          <button 
            onClick={generateReport}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 mx-auto"
          >
            <BrainCircuit size={20} />
            Generate Command Briefing
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-20 text-center space-y-8 animate-pulse">
           <Loader2 size={60} className="animate-spin text-indigo-500 mx-auto" />
           <div className="space-y-2">
             <h3 className="text-xl font-bold text-indigo-400">Synthesizing Longitudinal Intelligence...</h3>
             <p className="text-slate-500 text-sm italic">Analyzing Revenue Factory conversion rates & Metabolic corridors</p>
           </div>
        </div>
      )}

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-700">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <FileText size={150} />
               </div>
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                      <Sparkles size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Command Briefing: {report.horizon}</h2>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{report.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"><Download size={18} /></button>
                     <button className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"><Printer size={18} /></button>
                  </div>
               </div>

               <div className="space-y-8 relative z-10">
                  <section>
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Executive Summary</h3>
                    <p className="text-slate-300 leading-relaxed text-lg italic">"{report.executiveSummary}"</p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50">
                       <h4 className="text-[10px] font-black text-rose-400 uppercase mb-4 flex items-center gap-2">
                          <AlertCircle size={14} /> Primary Success Blocker
                       </h4>
                       <p className="text-slate-200 font-bold">{report.primaryBlocker}</p>
                    </div>
                    <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50">
                       <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-4 flex items-center gap-2">
                          <TrendingUp size={14} /> Revenue Forecast Q4
                       </h4>
                       <p className="text-slate-200 font-bold">{report.revenueForecast}</p>
                    </div>
                  </div>

                  <section>
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Tactical Directives</h3>
                    <div className="space-y-3">
                       {report.tacticalDirectives.map((dir, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                            <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-[10px] font-black text-indigo-400">{i+1}</div>
                            <span className="text-sm font-medium text-slate-300">{dir}</span>
                         </div>
                       ))}
                    </div>
                  </section>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                   <Target size={18} className="text-indigo-400" /> Success Scoring
                </h3>
                <div className="space-y-8">
                   <div className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Execution (MRR Factory)</span>
                         <span className="text-2xl font-black text-white">{report.businessHealthScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${report.businessHealthScore}%` }} />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Physiology (Peak Vitals)</span>
                         <span className="text-2xl font-black text-white">{report.physicalHealthScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${report.physicalHealthScore}%` }} />
                      </div>
                   </div>
                </div>

                <div className="mt-10 p-5 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck size={20} className="text-indigo-400" />
                      <span className="text-sm font-bold">2026 Path Security</span>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed">
                      Your current combined score is **{(report.businessHealthScore + report.physicalHealthScore) / 2}%**. You are mathematically on track for the $250,000 revenue target if execution efficiency remains above 85%.
                   </p>
                </div>
             </div>

             <div className="bg-gradient-to-br from-indigo-900/40 to-slate-950 border border-indigo-500/20 rounded-[2.5rem] p-8 space-y-6">
                <h3 className="font-bold flex items-center gap-2 text-indigo-300">
                   <Zap size={18} /> Daily Success Threshold
                </h3>
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <div className="mt-1"><ArrowRight size={14} className="text-indigo-400" /></div>
                      <p className="text-xs text-slate-400">Target 4 hours of **Tier A (Market Outreach)** before 12:00 PM.</p>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="mt-1"><ArrowRight size={14} className="text-indigo-400" /></div>
                      <p className="text-xs text-slate-400">Maintain Glucose stability between 4.5 and 5.8 mmol/L.</p>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="mt-1"><ArrowRight size={14} className="text-indigo-400" /></div>
                      <p className="text-xs text-slate-400">Complete AI Strategy refinement (Tier B) as a "Cool Down" activity.</p>
                   </div>
                </div>
                <button onClick={() => setReport(null)} className="w-full py-4 border border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/10 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">New Forecast</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingView;