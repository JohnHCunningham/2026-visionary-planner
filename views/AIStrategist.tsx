
import React, { useState } from 'react';
import { Sparkles, Send, BrainCircuit, Loader2, ListChecks, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { generateVisionaryPlan } from '../services/gemini';
import { StrategicPlan } from '../types';

const AIStrategist: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StrategicPlan | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateVisionaryPlan(input);
      setPlan(result);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Error generating plan. Please ensure your API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3">
          <Sparkles className="text-indigo-400" />
          2026 AI Strategist
        </h1>
        <p className="text-slate-400 text-lg">
          Connect your Revenue Factory concept to your health goals. Our AI will synthesize a bulletproof execution roadmap.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            className="w-full h-40 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-0 transition-all text-lg resize-none"
            placeholder="e.g., I want to reach $1M run-rate with the Revenue Factory by Q3 while maintaining a sub-10% body fat and high HRV..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
            {loading ? 'Synthesizing...' : 'Generate 2026 Strategy'}
          </button>
        </form>
      </div>

      {plan && (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Vision Statement */}
          <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Primary Vision 2026</h2>
            <p className="text-2xl font-medium italic leading-relaxed text-slate-100">
              "{plan.visionStatement}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Revenue Factory Refinement */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
                <TrendingUp size={24} /> Business Refinement
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {plan.revenueFactoryRefinement}
              </p>
            </div>

            {/* Health Optimizations */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-rose-400">
                <Activity size={24} /> Performance Optimizations
              </h3>
              <ul className="space-y-3">
                {plan.healthOptimizations.map((opt, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quarterly Roadmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <ListChecks className="text-indigo-400" /> 2026 Execution Roadmap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Fix: Explicitly cast entries to ensure 'goals' is recognized as string[] to avoid 'unknown' type error */}
              {(Object.entries(plan.quarterlyRoadmap) as [string, string[]][]).map(([quarter, goals]) => (
                <div key={quarter} className="space-y-4">
                  <div className="bg-slate-800 px-3 py-1 rounded-lg inline-block text-xs font-bold text-slate-300">
                    {quarter}
                  </div>
                  <ul className="space-y-3">
                    {goals.map((goal, idx) => (
                      <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                        <ArrowRight size={14} className="shrink-0 mt-0.5 text-indigo-500/50" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStrategist;
