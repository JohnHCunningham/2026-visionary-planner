import React from 'react';
import { 
  Network, Cpu, Zap, ShieldCheck, Database, 
  Workflow, ArrowRight, Target, Brain, 
  Microscope, LineChart, Globe, DollarSign
} from 'lucide-react';

const IntelligenceNode = ({ title, icon: Icon, desc, color, tech }: any) => (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/40 transition-all group">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon size={24} className="text-white" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed mb-4">{desc}</p>
    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Core Engine</span>
      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">{tech}</span>
    </div>
  </div>
);

const SystemIntelligence: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">System Blueprint</h1>
          <p className="text-slate-400 font-medium">The Intelligence Architecture of Vision 2026</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <ShieldCheck className="text-emerald-500" size={20} />
          <div className="text-left">
            <div className="text-[10px] font-black text-emerald-500 uppercase">System Integrity</div>
            <div className="text-xs font-bold text-slate-300">Quarter-Million Goal Synced</div>
          </div>
        </div>
      </div>

      {/* REVENUE TRAJECTORY VISUALIZER */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 lg:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Target className="text-indigo-400" />
              The $250,000 Success Path
            </h2>
            <p className="text-slate-400 leading-relaxed">
              To hit $250,000 in 2026, the system calculates a necessary **Monthly Recurring Revenue (MRR) of $20,833**. This requires a 85% execution efficiency in Tier A tasks (Outreach & B2B AI Service delivery).
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Current Trajectory Readiness</span>
                <span className="text-2xl font-black text-emerald-400">72%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-gradient-to-r from-indigo-500 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase italic">
                <span>Phase: Foundation (Q1)</span>
                <span>Target: Scaling (Q3)</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
              <DollarSign className="text-indigo-400 mb-2" size={24} />
              <div className="text-2xl font-black">$20.8k</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Target MRR</div>
            </div>
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
              <Zap className="text-amber-400 mb-2" size={24} />
              <div className="text-2xl font-black">4.2h</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Daily Tier A Input</div>
            </div>
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
              <Microscope className="text-cyan-400 mb-2" size={24} />
              <div className="text-2xl font-black">Stable</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Metabolic Load</div>
            </div>
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
              <Globe className="text-rose-400 mb-2" size={24} />
              <div className="text-2xl font-black">Native</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">AI Service Layer</div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE INTELLIGENCE NEURONS */}
      <div>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Brain className="text-indigo-400" /> Logic Neurons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <IntelligenceNode 
            title="Strategic Architect"
            icon={Workflow}
            desc="The high-level reasoning engine that maps business goals to metabolic requirements. It builds your multi-quarter roadmap."
            color="bg-indigo-600"
            tech="Gemini 3 Pro"
          />
          <IntelligenceNode 
            title="Execution Monitor"
            icon={LineChart}
            desc="Real-time analysis of 'Time Leakage' vs 'High-Value Input'. It calculates the traffic-light status of your $250k goal."
            color="bg-cyan-600"
            tech="Gemini 3 Flash"
          />
          <IntelligenceNode 
            title="Performance Coach"
            icon={Zap}
            desc="Voice-activated recovery sync. Monitors your 'Active Recovery Protocol' to ensure zero physiological burnout."
            color="bg-amber-600"
            tech="Live API Native Audio"
          />
          <IntelligenceNode 
            title="B2B Factory Engine"
            icon={Network}
            desc="Automatically architects AI services (Customer Ops, RAG pipelines) based on current market trends and pricing power."
            color="bg-emerald-600"
            tech="Gemini 3 Flash"
          />
          <IntelligenceNode 
            title="Physiological Audit"
            icon={Database}
            desc="The longitudinal data store for your BP, Glucose, and Sleep. Protects the entrepreneur from systemic health failure."
            color="bg-rose-600"
            tech="Structured JSON Schemas"
          />
          <IntelligenceNode 
            title="Intelligence Briefing"
            icon={Brain}
            desc="Synthesizes all cross-domain data into blunt, executive reports. Translates complex metrics into actionable directives."
            color="bg-violet-600"
            tech="Gemini 3 Pro Briefing"
          />
        </div>
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck size={24} className="text-indigo-400" />
            2026 Strategy Lock
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            This application is built on the philosophy that **Business Success is a Physiological Outcome**. By linking your $250,000 revenue target directly to your metabolic stability, the AI ensures you don't just "hit the number"—you build the stamina to sustain it.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Success Probability</div>
            <div className="text-2xl font-black text-emerald-400">89%</div>
          </div>
          <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Burnout Risk</div>
            <div className="text-2xl font-black text-rose-400">Low</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemIntelligence;