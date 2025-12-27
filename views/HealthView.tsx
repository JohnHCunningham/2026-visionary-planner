
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
import { storage } from '../services/storage';

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
  const latest = logs[logs.length - 1] || logs[0];
  
  const vitalTrends: Array<{ label: string; wow: { value: string; status: TrendStatus }; mom: { value: string; status: TrendStatus }; yoy: { value: string; status: TrendStatus } }> = [
    { label: 'Blood Pressure', wow: { value: '-4%', status: 'improvement' }, mom: { value: '-8%', status: 'improvement' }, yoy: { value: '-12%', status: 'improvement' } },
    { label: 'Fasting Glucose', wow: { value: '+2%', status: 'stable' }, mom: { value: '-15%', status: 'improvement' }, yoy: { value: '-18%', status: 'improvement' } },
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-bold flex items-center gap-3"><Activity className="text-indigo-400" /> Systemic Bio-Trends</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vitalTrends.map((t, i) => (
            <div key={i} className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/30 transition-all">
               <div className="text-[10px] font-black text-slate-500 uppercase mb-3">{t.label}</div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="text-[9px] text-slate-600 font-bold uppercase">WoW</span> <TrendIndicator {...t.wow} /></div>
                  <div className="flex justify-between items-center"><span className="text-[9px] text-slate-600 font-bold uppercase">MoM</span> <TrendIndicator {...t.mom} /></div>
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
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Heart Rate</p>
           <h4 className="text-2xl font-black">{latest.pulse} <span className="text-xs font-normal text-slate-500">BPM</span></h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100"><Heart className="text-rose-400" /> BP Strategic Corridor</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[60, 180]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="systolic" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} name="Systolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const HealthView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'analytics'>('analytics');
  const [logs, setLogs] = useState<HealthLogEntry[]>([]);

  useEffect(() => {
    const refreshData = () => {
      setLogs(storage.getHealth());
    };
    
    refreshData();
    window.addEventListener('storage-update', refreshData);
    
    const handleVitalsUpdate = (e: any) => {
      const latest = storage.getHealth()[storage.getHealth().length - 1];
      const newEntry: HealthLogEntry = {
        date: new Date().toISOString().split('T')[0],
        systolic: e.detail.systolic || latest.systolic,
        diastolic: e.detail.diastolic || latest.diastolic,
        glucose: e.detail.glucose || latest.glucose,
        pulse: e.detail.pulse || latest.pulse,
        oxygen: e.detail.oxygen || latest.oxygen,
        weight: e.detail.weight || latest.weight,
        isFasting: true,
        sleepHours: latest.sleepHours,
        fastingHours: latest.fastingHours
      };
      const updated = [...storage.getHealth(), newEntry];
      storage.saveHealth(updated);
    };

    window.addEventListener('vitals-update', handleVitalsUpdate);
    return () => {
      window.removeEventListener('storage-update', refreshData);
      window.removeEventListener('vitals-update', handleVitalsUpdate);
    };
  }, []);

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Bio-Performance Hub</h1>
          <p className="text-slate-400 text-lg">Optimizing physiological foundation for peak execution.</p>
        </div>
        <div className="flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Trend Matrix</button>
        </div>
      </div>
      <AnalyticsTab logs={logs} />
    </div>
  );
};

export default HealthView;
