
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Activity, Droplets, Heart, Wind, Moon, Scale, Timer, Trophy, Flame, 
  Microscope, PlusCircle, Save, BarChart3, Info, ChevronRight, Loader2, Radio,
  Sparkles, CheckCircle2, Play, Square, RefreshCw, Zap, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, ReferenceArea, ReferenceLine
} from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import { HealthLogEntry } from '../types';

const initialVitalLogs: HealthLogEntry[] = [
  { date: '2025-12-12', systolic: 145, diastolic: 92, pulse: 78, glucose: 7.9, isFasting: true, oxygen: 96, weight: 359.3, sleepHours: 7.0, fastingHours: 16 },
  { date: '2025-12-14', systolic: 140, diastolic: 88, pulse: 75, glucose: 10.2, isFasting: true, oxygen: 96, weight: 359.1, sleepHours: 6.5, fastingHours: 14 },
  { date: '2025-12-17', systolic: 122, diastolic: 78, pulse: 68, glucose: 6.2, isFasting: true, oxygen: 93, weight: 358.8, sleepHours: 7.5, fastingHours: 18 },
  { date: '2025-12-20', systolic: 118, diastolic: 76, pulse: 65, glucose: 5.4, isFasting: true, oxygen: 98, weight: 358.5, sleepHours: 8.0, fastingHours: 16 },
  { date: '2025-12-22', systolic: 116, diastolic: 74, pulse: 70, glucose: 5.1, oxygen: 99, weight: 358.2, isFasting: true, sleepHours: 7.2, fastingHours: 17 },
];

type TrendStatus = 'improvement' | 'stable' | 'deteriorating';

const TrendIndicator = ({ status, value }: { status: TrendStatus; value: string }) => {
  const styles = {
    improvement: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: ArrowUpRight },
    stable: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Minus },
    deteriorating: { color: 'text-rose-400', bg: 'bg-rose-500/10', icon: ArrowDownRight },
  };
  const { color, bg, icon: Icon } = styles[status];
  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${bg} ${color}`}>
      <Icon size={10} /> {value}
    </div>
  );
};

const AnalyticsTab = ({ logs }: { logs: HealthLogEntry[] }) => {
  const latest = logs[logs.length - 1] || initialVitalLogs[0];
  
  // Fix: Data objects updated to use 'value' property and typed to match TrendIndicator interface
  const vitalTrends: Array<{ label: string; wow: { value: string; status: TrendStatus }; mom: { value: string; status: TrendStatus }; yoy: { value: string; status: TrendStatus } }> = [
    { label: 'Blood Pressure', wow: { value: '-4%', status: 'improvement' }, mom: { value: '-8%', status: 'improvement' }, yoy: { value: '-12%', status: 'improvement' } },
    { label: 'Fasting Glucose', wow: { value: '+2%', status: 'stable' }, mom: { value: '-15%', status: 'improvement' }, yoy: { value: '-18%', status: 'improvement' } },
    { label: 'Deep Sleep Ratio', wow: { value: '-10%', status: 'deteriorating' }, mom: { value: '+2%', status: 'stable' }, yoy: { value: '+24%', status: 'improvement' } },
    { label: 'Resting Heart Rate', wow: { value: '-1bpm', status: 'improvement' }, mom: { value: '-4bpm', status: 'improvement' }, yoy: { value: '-8bpm', status: 'improvement' } },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      {/* TREND COMPARISON MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-bold flex items-center gap-3">
             <Activity className="text-indigo-400" /> Systemic Bio-Trends
           </h3>
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Longitudinal Performance Corridor</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vitalTrends.map((t, i) => (
            <div key={i} className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/30 transition-all">
               <div className="text-[10px] font-black text-slate-500 uppercase mb-3">{t.label}</div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="text-[9px] text-slate-600 font-bold uppercase">WoW</span> <TrendIndicator {...t.wow} /></div>
                  <div className="flex justify-between items-center"><span className="text-[9px] text-slate-600 font-bold uppercase">MoM</span> <TrendIndicator {...t.mom} /></div>
                  <div className="flex justify-between items-center"><span className="text-[9px] text-slate-600 font-bold uppercase">YoY</span> <TrendIndicator {...t.yoy} /></div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden text-slate-100 shadow-xl">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Blood Pressure</p>
           <h4 className="text-2xl font-black">{latest.systolic}/{latest.diastolic} <span className="text-xs font-normal text-slate-500">mmHg</span></h4>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden text-slate-100 shadow-xl">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Fasting Glucose</p>
           <h4 className="text-2xl font-black">{latest.glucose.toFixed(1)} <span className="text-xs font-normal text-slate-500">mmol/L</span></h4>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden text-slate-100 shadow-xl">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Oxygen Saturation</p>
           <h4 className="text-2xl font-black">{latest.oxygen}% <span className="text-xs font-normal text-slate-500">SpO2</span></h4>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden text-slate-100 shadow-xl">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Heart Rate</p>
           <h4 className="text-2xl font-black">{latest.pulse} <span className="text-xs font-normal text-slate-500">BPM</span></h4>
        </div>
      </div>

      {/* Main Charts - High Visibility Corridor Rendering */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100"><Heart className="text-rose-400" /> BP Strategic Corridor</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <ReferenceArea y1={0} y2={120} fill="#10b981" fillOpacity={0.05} />
                <ReferenceArea y1={120} y2={140} fill="#f59e0b" fillOpacity={0.05} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[60, 180]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="systolic" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#fb7185" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100"><Droplets className="text-cyan-400" /> Metabolic Window Corridor</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <ReferenceArea y1={3.9} y2={5.6} fill="#06b6d4" fillOpacity={0.1} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[3, 12]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="glucose" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={3} name="Fasting Glucose" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const FastingTimer = ({ targetHours }: { targetHours: number }) => {
  const [isActive, setIsActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && startTime) {
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const targetSecs = targetHours * 3600;
        if (elapsed >= targetSecs) { setSecondsElapsed(targetSecs); setIsActive(false); }
        else { setSecondsElapsed(elapsed); }
      }, 1000);
    } else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, startTime, targetHours]);

  const toggleTimer = () => {
    if (!isActive) setStartTime(Date.now() - (secondsElapsed * 1000));
    setIsActive(!isActive);
  };

  const targetSeconds = targetHours * 3600;
  const progress = targetSeconds > 0 ? (secondsElapsed / targetSeconds) * 100 : 0;
  const isComplete = secondsElapsed >= targetSeconds && targetSeconds > 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`bg-slate-900 border ${isComplete ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-slate-800'} rounded-[2rem] p-8 relative overflow-hidden transition-all duration-700`}>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-sm font-bold flex items-center gap-2 tracking-tight">
            <Timer className={isComplete ? 'text-emerald-400' : 'text-amber-400'} size={18} />
            Metabolic Sync
          </h3>
          <span className="text-[10px] font-bold px-3 py-1 rounded bg-slate-800 border border-slate-700 uppercase">{targetHours}H GOAL</span>
        </div>
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
            <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" className={`transition-all duration-1000 ease-out ${isComplete ? 'text-emerald-500' : 'text-amber-500'}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-2xl font-mono font-black ${isComplete ? 'text-emerald-400' : 'text-slate-100'}`}>{Math.floor(secondsElapsed / 3600)}H</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Elapsed</div>
          </div>
        </div>
        <button onClick={toggleTimer} className={`w-full py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}>
          {isActive ? 'Stop Monitoring' : 'Initiate Fast'}
        </button>
      </div>
    </div>
  );
};

const TrackerTab = ({ logs, onAddEntry }: { logs: HealthLogEntry[], onAddEntry: (entry: HealthLogEntry) => void }) => {
  const [formData, setFormData] = useState<Partial<HealthLogEntry>>({
    date: new Date().toISOString().split('T')[0], systolic: 120, diastolic: 80, pulse: 70, glucose: 5.5, sleepHours: 7.5, fastingHours: 16, weight: 350
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry(formData as HealthLogEntry);
    alert('Biometrics synched.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6 sticky top-6">
        <FastingTimer targetHours={16} />
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
           <h3 className="text-lg font-bold mb-8">Manual Terminal</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sys</label><input type="number" value={formData.systolic} onChange={e => setFormData({...formData, systolic: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" /></div>
                 <div><label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Dia</label><input type="number" value={formData.diastolic} onChange={e => setFormData({...formData, diastolic: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" /></div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 py-3 rounded-xl font-bold shadow-lg mt-4">Record Vitals</button>
           </form>
        </div>
      </div>
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-8">Snapshot Trends</h3>
        <div className="h-[400px]">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={logs}>
               <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
               <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
               <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
               <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px' }} />
               <Line type="monotone" dataKey="systolic" stroke="#818cf8" strokeWidth={3} dot={{ r: 4 }} />
               <Line type="monotone" dataKey="glucose" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const HealthView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routine' | 'tracker' | 'analytics'>('analytics');
  const [logs, setLogs] = useState<HealthLogEntry[]>(initialVitalLogs);

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-100">Bio-Performance Hub</h1>
          <p className="text-slate-400 text-lg">Optimizing physiological foundation for peak execution.</p>
        </div>
        <div className="flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
             <BarChart3 size={16} className="inline mr-1.5" /> Trend Matrix
          </button>
          <button onClick={() => setActiveTab('tracker')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'tracker' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Vitals Log</button>
        </div>
      </div>
      {activeTab === 'tracker' ? <TrackerTab logs={logs} onAddEntry={entry => setLogs([...logs, entry])} /> : <AnalyticsTab logs={logs} />}
    </div>
  );
};

export default HealthView;
