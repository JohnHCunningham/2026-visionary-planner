import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Factory, 
  Activity, 
  Sparkles, 
  Menu, 
  X, 
  BrainCircuit, 
  Clock,
  FileText,
  Network
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import RevenueFactoryView from './views/RevenueFactoryView';
import HealthView from './views/HealthView';
import AIStrategist from './views/AIStrategist';
import ReportingView from './views/ReportingView';
import SystemIntelligence from './views/SystemIntelligence';
import LiveAssistant from './components/LiveAssistant';
import ChatAssistant from './components/ChatAssistant';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  
  const navItems = [
    { name: '2026 Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Command Briefings', path: '/reports', icon: FileText },
    { name: 'System Blueprint', path: '/blueprint', icon: Network },
    { name: 'Revenue Factory', path: '/factory', icon: Factory },
    { name: 'Performance & Health', path: '/health', icon: Activity },
    { name: 'AI Strategist', path: '/ai-lab', icon: Sparkles },
  ];

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={toggle} className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-slate-900 border-r border-slate-800 shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <BrainCircuit className="text-indigo-400" />
              VISION 2026
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Peak Performance Hub</p>
          </div>

          <nav className="flex-1 px-4 space-y-2 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                >
                  <Icon size={20} />
                  <span className="font-semibold text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-800">
            <div className="bg-indigo-900/20 border border-indigo-500/10 rounded-xl p-4">
              <p className="text-[10px] text-indigo-300 font-bold mb-2 flex items-center gap-2 uppercase tracking-tight">
                <Clock size={12} /> 2026 Status
              </p>
              <div className="text-sm font-mono text-white">
                Year of Execution
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-x-hidden">
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-10 pt-20 lg:pt-10 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<ReportingView />} />
              <Route path="/blueprint" element={<SystemIntelligence />} />
              <Route path="/factory" element={<RevenueFactoryView />} />
              <Route path="/health" element={<HealthView />} />
              <Route path="/ai-lab" element={<AIStrategist />} />
            </Routes>
          </div>
        </main>
        
        <ChatAssistant />
        <LiveAssistant />
      </div>
    </HashRouter>
  );
};

export default App;