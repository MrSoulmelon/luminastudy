
import React, { useState } from 'react';
import { Mail, Lock, Github, Chrome, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface AuthFormProps {
  onLogin: (email: string, name: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(email, email.split('@')[0]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 pb-0">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 rotate-3">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
            Elevate your studying with Lumina AI
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-gray-200 dark:border-slate-700">
              <Chrome className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-gray-200 dark:border-slate-700">
              <Github className="w-5 h-5 text-gray-900 dark:text-white" />
              <span className="text-sm font-semibold">GitHub</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-gray-400">Or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" required placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Full Name</label>
                <input 
                  type="text" required placeholder="Alex Johnson"
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Password</label>
                {isLogin && <button type="button" className="text-xs font-semibold text-primary-500 hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
