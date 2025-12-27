
import React, { useState, useMemo, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
  Target, Zap, TrendingUp, ShieldCheck, Timer, 
  Plus, Calendar, CheckCircle2, 
  Activity, Factory, DollarSign, Heart, Repeat, LayoutList, Radio,
  X, Loader2, Sparkles, Trophy, BookOpen, Clock, BrainCircuit, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Minus, ChevronRight, BarChart3
} from 'lucide-react';
import { Goal, Task, ValueTier } from '../types';
import { GoogleGenAI } from "@google/genai";

const TIER_META = {
  A: { label: 'Highly Valuable', color: '#10b981', icon: Trophy, desc: 'Revenue & Growth' },
  B: { label: 'Medium Value', color: '#f59e0b', icon: Zap, desc: 'Strategy & Learning' },
  C: { label: 'Busy Work', color: '#64748b', icon: Clock, desc: 'Maintenance / Leaks' }
};

type TrendStatus = 'improvement' | 'stable' | 'deteriorating';

// Fix: TrendMetric interface property 'val' changed to 'value' to match TrendBadge component requirements
interface TrendMetric {
  label: string;
  wow: { value: string; status: TrendStatus };
  mom: { value: string; status: TrendStatus };
  yoy: { value: string; status: TrendStatus };
}

const TrendBadge = ({ status, value }: { status: TrendStatus; value: string }) => {
  const styles = {
    improvement: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: ArrowUpRight },
    stable: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Minus },
    deteriorating: { color: 'text-rose-400', bg: 'bg-rose-500/10', icon: ArrowDownRight },
  };
  const { color, bg, icon: Icon } = styles[status];
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-mono text-[10px] font-bold ${bg} ${color}`}>
      <Icon size={12} />
      {value}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Market Outreach: 20 Personalized Proposals', category: 'Financial', type: 'Priority', valueTier: 'A', plannedMinutes: 120, actualMinutes: 95, completed: true },
    { id: 't2', title: 'AI Learning: Advanced RAG Architecture', category: 'Learning', type: 'Daily', valueTier: 'B', plannedMinutes: 45, actualMinutes: 30, completed: true },
    { id: 't3', title: 'Scrolling / News Consumption', category: 'Personal', type: 'Daily', valueTier: 'C', plannedMinutes: 15, actualMinutes: 45, completed: true },
    { id: 't4', title: 'Revenue Factory Audit', category: 'Financial', type: 'Daily', valueTier: 'A', plannedMinutes: 30, actualMinutes: 0, completed: false },
  ]);

  const [coachFeedback, setCoachFeedback] = useState<string | null>(null);
  const [isCoaching, setIsCoaching] = useState(false);

  // Fix: Data objects updated to use 'value' property to match TrendBadge interface
  const strategicTrends: TrendMetric[] = [
    { 
      label: 'Market Outreach Velocity', 
      wow: { value: '+14%', status: 'improvement' }, 
      mom: { value: '+8%', status: 'improvement' }, 
      yoy: { value: '+112%', status: 'improvement' } 
    },
    { 
      label: 'AI Learning Hours', 
      wow: { value: '-2%', status: 'stable' }, 
      mom: { value: '+15%', status: 'improvement' }, 
      yoy: { value: '+45%', status: 'improvement' } 
    },
    { 
      label: 'Scrolling/Distraction Leak', 
      wow: { value: '+12%', status: 'deteriorating' }, 
      mom: { value: '-5%', status: 'improvement' }, 
      yoy: { value: '-22%', status: 'improvement' } 
    },
    { 
      label: 'Revenue Conversion Rate', 
      wow: { value: '0%', status: 'stable' }, 
      mom: { value: '+2.1%', status: 'improvement' }, 
      yoy: { value: '+8.4%', status: 'improvement' } 
    }
  ];

  const timeMetrics = useMemo(() => {
    return [
      { name: 'Tier A', value: tasks.filter(t => t.valueTier === 'A').reduce((acc, t) => acc + (t.actualMinutes || 0), 0), color: TIER_META.A.color },
      { name: 'Tier B', value: tasks.filter(t => t.valueTier === 'B').reduce((acc, t) => acc + (t.actualMinutes || 0), 0), color: TIER_META.B.color },
      { name: 'Tier C', value: tasks.filter(t => t.valueTier === 'C').reduce((acc, t) => acc + (t.actualMinutes || 0), 0), color: TIER_META.C.color },
    ].filter(d => d.value > 0);
  }, [tasks]);

  const runTimeCoach = async () => {
    setIsCoaching(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze my 2026 performance trends. 
        Market Outreach is Tier A (Priority). AI Learning is Tier B. Scrolling is Tier C.
        Current Trends: 
        Outreach: WoW +14% (Green)
        Distraction Leak: WoW +12% (Red)
        Provide a sharp tactical correction to re-align with the 2026 Revenue Factory goals.`,
      });
      // Correct usage of response.text as a property
      setCoachFeedback(response.text ?? "Unable to generate analysis.");
    } catch (e) { console.error(e); } finally { setIsCoaching(false); }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, actualMinutes: !t.completed ? t.plannedMinutes : 0 } : t));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Execution Hub 2026</h1>
          <p className="text-slate-400 font-medium">Systemic Trend Analysis & High-Output Calibration</p>
        </div>
        <button 
          onClick={runTimeCoach}
          disabled={isCoaching}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/30"
        >
          {isCoaching ? <Loader2 size={20} className="animate-spin" /> : <BrainCircuit size={20} />}
          AI Trend Coach
        </button>
      </div>

      {/* STRATEGIC TREND MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <TrendingUp size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="text-indigo-400" />
              Strategic Performance Matrix
            </h2>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold opacity-60">Week over Week • Month over Month • Year over Year</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[10px] font-bold text-slate-400">Improved</span></div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> <span className="text-[10px] font-bold text-slate-400">Stable</span></div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-[10px] font-bold text-slate-400">Systemic Risk</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {strategicTrends.map((trend, i) => (
            <div key={i} className="group grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-5 rounded-2xl bg-slate-950/30 border border-slate-800 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <Target size={18} />
                 </div>
                 <span className="font-bold text-slate-200">{trend.label}</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Week over Week</span>
                 <TrendBadge {...trend.wow} />
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Month over Month</span>
                 <TrendBadge {...trend.mom} />
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Year over Year (2025 vs 2026)</span>
                 <TrendBadge {...trend.yoy} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           {/* DAILY AUDIT */}
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Repeat className="text-emerald-400" /> Real-time Execution Loop
                </h3>
             </div>
             <div className="space-y-4">
               {tasks.map(task => {
                 const Meta = TIER_META[task.valueTier];
                 const Icon = Meta.icon;
                 return (
                   <div key={task.id} className={`flex items-center gap-4 p-5 rounded-3xl border transition-all ${task.completed ? 'bg-slate-900/50 border-slate-800 opacity-50' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-500'}`}>
                      <button onClick={() => toggleTask(task.id)} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'}`}>
                        {task.completed ? <CheckCircle2 size={20} /> : <Icon size={18} className="text-slate-500" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{task.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black uppercase" style={{ color: Meta.color }}>Tier {task.valueTier}</span>
                           <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock size={12} /> {task.plannedMinutes}m target</span>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-bold text-slate-500 uppercase">Input</div>
                         <div className="font-mono font-bold text-indigo-400">{task.actualMinutes || 0}m</div>
                      </div>
                   </div>
                 );
               })}
             </div>
           </div>

           {coachFeedback && (
             <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-10 relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <BrainCircuit size={120} className="text-indigo-400" />
               </div>
               <div className="relative z-10">
                 <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-4">
                   <Sparkles size={20} /> AI Strategic Trend Insight
                 </h3>
                 <p className="text-slate-300 leading-relaxed italic whitespace-pre-wrap">{coachFeedback}</p>
                 <button onClick={() => setCoachFeedback(null)} className="mt-6 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Acknowledge Analysis</button>
               </div>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-lg font-bold mb-8">Value Partitioning</h3>
              <div className="h-56 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={timeMetrics} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                       {timeMetrics.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                     </Pie>
                     <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Today</span>
                    <span className="text-2xl font-black text-white">{timeMetrics.reduce((acc, curr) => acc + curr.value, 0)}m</span>
                 </div>
              </div>
              <div className="mt-8 space-y-4">
                 {Object.entries(TIER_META).map(([key, meta]) => (
                   <div key={key} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full" style={{ background: meta.color }} />
                         <div>
                            <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">Tier {key}</div>
                            <div className="text-[9px] text-slate-500 uppercase font-bold">{meta.desc}</div>
                         </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-700" />
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-900/30 to-slate-950 border border-indigo-500/20 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="text-indigo-400" size={24} />
                 <h3 className="font-bold">Protocol Health</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Execution stability is currently "Yellow". While Tier A output is increasing WoW, your Tier C distraction leakage is trending "Red" (+12%).
              </p>
              <div className="space-y-4">
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%]" />
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Efficiency Rate</span>
                    <span className="text-indigo-400">65% Optimal</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;