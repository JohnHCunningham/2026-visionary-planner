
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Heart, Droplets, Wind, Scale, Zap, Info, ChevronRight, TrendingUp
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceArea
} from 'recharts';
import { HealthLogEntry } from '../types';
import { storage } from '../services/storage';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-sm font-bold text-white">{p.name}: {p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const HealthView: React.FC = () => {
  const [logs, setLogs] = useState<HealthLogEntry[]>([]);

  useEffect(() => {
    const refresh = () => setLogs(storage.getHealth());
    refresh();
    window.addEventListener('storage-update', refresh);
    return () => window.removeEventListener('storage-update', refresh);
  }, []);

  const latest = logs[logs.length - 1] || {};

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Performance Hub</h1>
          <p className="text-slate-400 font-medium">Physiological Foundation for 2026 Strategy</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase">System Optimal</span>
           </div>
        </div>
      </div>

      {/* Vitals Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Blood Pressure</span>
            <Heart size={16} className="text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latest.systolic}/{latest.diastolic}</span>
            <span className="text-xs text-slate-500">mmHg</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fasting Glucose</span>
            <Droplets size={16} className="text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latest.glucose?.toFixed(1)}</span>
            <span className="text-xs text-slate-500">mmol/L</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Oxygen Saturation</span>
            <Wind size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latest.oxygen}%</span>
            <span className="text-xs text-slate-500">SpO2</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Heart Rate</span>
            <Activity size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latest.pulse}</span>
            <span className="text-xs text-slate-500">BPM</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BP Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
              <Heart size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">BP Strategic Corridor</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  tick={{ fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{ fontSize: 10, fontWeight: 'bold' }} 
                  domain={[60, 180]}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceArea y1={110} y2={130} fill="#f43f5e" fillOpacity={0.05} />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  name="Systolic"
                  stroke="#f43f5e" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  name="Diastolic"
                  stroke="#f43f5e" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#0f172a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Glucose Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
              <Droplets size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Metabolic Window Corridor</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs}>
                <defs>
                  <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  tick={{ fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{ fontSize: 10, fontWeight: 'bold' }} 
                  domain={[3, 12]}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceArea y1={4.0} y2={6.0} fill="#06b6d4" fillOpacity={0.1} />
                <Area 
                  type="monotone" 
                  dataKey="glucose" 
                  name="Glucose"
                  stroke="#06b6d4" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorGlucose)"
                  dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#0f172a' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
               <TrendingUp size={24} />
            </div>
            <div>
               <h4 className="font-bold text-lg">System Intelligence Insight</h4>
               <p className="text-sm text-slate-400">Baseline stabilized for Q1 2026 execution. Strategic recovery protocols active.</p>
            </div>
         </div>
         <button className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
            Full Audit Report <ChevronRight size={14} />
         </button>
      </div>
    </div>
  );
};

export default HealthView;
