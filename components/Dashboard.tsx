
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Clock, Target, Award, BrainCircuit, ArrowRight } from 'lucide-react';
import { StudyPlan } from '../types';

const data = [
  { name: 'Mon', hours: 4 },
  { name: 'Tue', hours: 3 },
  { name: 'Wed', hours: 5 },
  { name: 'Thu', hours: 2 },
  { name: 'Fri', hours: 6 },
  { name: 'Sat', hours: 8 },
  { name: 'Sun', hours: 4 },
];

interface DashboardProps {
  plan: StudyPlan | null;
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, Alex! 👋</h2>
          <p className="text-gray-500 dark:text-gray-400">Here's your study progress and upcoming tasks.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('planner')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20"
          >
            <PlusIcon className="w-4 h-4" /> New Plan
          </button>
        </div>
      </header>

      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Modules" value={plan.suggestedCategories.length.toString()} icon={BookOpen} color="blue" />
          <StatCard title="Hours Available" value={`${plan.dailyTimetable.length} Slots`} icon={Clock} color="purple" />
          <StatCard title="Today's Target" value="Chapter 4 Review" icon={Target} color="emerald" />
          <StatCard title="Current Streak" value="7 Days" icon={Award} color="orange" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Study Intensity (Last 7 Days)</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div> Hours
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="w-6 h-6 text-primary-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Daily Inspiration</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
            <p className="text-xl font-medium italic text-gray-700 dark:text-gray-300 leading-relaxed">
              "{plan?.motivationalQuote || "The only way to learn a new programming language is by writing programs in it."}"
            </p>
            <span className="mt-4 text-sm font-semibold text-primary-500">— Lumina AI</span>
          </div>
          <button 
            onClick={() => onNavigate('plan-view')}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
          >
            View Full Timetable <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Upcoming Milestones</h3>
          <div className="space-y-4">
            {plan?.roadmap.slice(0, 3).map((m, idx) => (
              <div key={idx} className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                  <span className="text-sm font-bold">{idx + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{m.title}</h4>
                  <p className="text-xs text-gray-500 mb-1">{m.targetDate}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{m.description}</p>
                </div>
              </div>
            )) || <p className="text-gray-400 text-sm">No milestones generated yet. Go to the Planner to start.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Weekly Summary</h3>
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {plan?.weeklySummary || "Your weekly analysis will appear here after you generate a plan."}
            </p>
          </div>
          <div className="mt-6">
             <h4 className="text-sm font-bold mb-3 text-gray-500 uppercase tracking-widest">Recommended Categories</h4>
             <div className="flex flex-wrap gap-2">
               {plan?.suggestedCategories.map((cat, i) => (
                 <span key={i} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full border border-primary-100 dark:border-primary-800">
                   {cat}
                 </span>
               )) || <span className="text-gray-400 text-xs italic">Awaiting syllabus...</span>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default Dashboard;
