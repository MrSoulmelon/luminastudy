
import React, { useState } from 'react';
import { UserInputs, Difficulty } from '../types';
import { Calendar, Clock, AlertTriangle, Zap, CheckCircle2, FileText, ChevronRight, Loader2 } from 'lucide-react';
import FileDropzone from './FileDropzone';

interface PlannerWizardProps {
  onGenerate: (inputs: UserInputs) => void;
  isLoading: boolean;
}

const PlannerWizard: React.FC<PlannerWizardProps> = ({ onGenerate, isLoading }) => {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<UserInputs>({
    syllabus: '',
    examDate: '',
    hoursPerDay: 4,
    weakAreas: '',
    difficulty: 'Medium'
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (step === 1) return inputs.syllabus.length > 20;
    if (step === 2) return inputs.examDate && inputs.hoursPerDay > 0;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 relative">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-500'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`text-xs font-medium uppercase tracking-wider ${
                step >= s ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
              }`}>
                {s === 1 ? 'Syllabus' : s === 2 ? 'Schedule' : 'Goals'}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-10 right-10 h-[2px] bg-gray-100 dark:bg-slate-800 -z-0">
            <div 
              className="h-full bg-primary-600 transition-all duration-500" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Import Your Syllabus</h3>
              <p className="text-gray-500 dark:text-gray-400">Upload a PDF/DOCX file or paste text directly.</p>
            </div>
            
            <FileDropzone onFileParsed={(text) => setInputs(prev => ({ ...prev, syllabus: text }))} />

            <div className="relative group">
              <textarea
                value={inputs.syllabus}
                onChange={(e) => setInputs({...inputs, syllabus: e.target.value})}
                placeholder="...or paste your module topics, chapters, or syllabus requirements here manually."
                className="w-full h-40 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none resize-none text-sm text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-amber-700 dark:text-amber-400">
              <FileText className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs">Extracted text will appear above. You can edit it before continuing.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Configure Your Schedule</h3>
              <p className="text-gray-500 dark:text-gray-400">When is the big day and how much can you commit?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-primary-500" /> Exam Date
                </label>
                <input 
                  type="date" 
                  value={inputs.examDate}
                  onChange={(e) => setInputs({...inputs, examDate: e.target.value})}
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-white"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-primary-500" /> Daily Hours
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="1" max="16" 
                    value={inputs.hoursPerDay}
                    onChange={(e) => setInputs({...inputs, hoursPerDay: parseInt(e.target.value)})}
                    className="flex-1 accent-primary-600"
                  />
                  <span className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold rounded-xl flex items-center justify-center">
                    {inputs.hoursPerDay}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Intensity Level</h4>
              <div className="grid grid-cols-3 gap-4">
                {(['Easy', 'Medium', 'Intense'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setInputs({...inputs, difficulty: level})}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      inputs.difficulty === level 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                        : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <Zap className={`w-6 h-6 ${level === 'Easy' ? 'text-emerald-500' : level === 'Medium' ? 'text-blue-500' : 'text-red-500'}`} />
                    <span className="font-semibold text-sm">{level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Final Details</h3>
              <p className="text-gray-500 dark:text-gray-400">Target your specific challenges.</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Weak Areas (Optional)
              </label>
              <textarea
                value={inputs.weakAreas}
                onChange={(e) => setInputs({...inputs, weakAreas: e.target.value})}
                placeholder="E.g., I struggle with Calculus integration or CSS Grid..."
                className="w-full h-32 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-800 flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-primary-700 dark:text-primary-400">Lumina AI is ready</h4>
                <p className="text-sm text-primary-600/80 dark:text-primary-400/60">We will build a spaced-repetition plan and dynamic timetable based on your {inputs.syllabus.split(' ').length} words of syllabus content.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1 || isLoading}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              step === 1 ? 'opacity-0 cursor-default' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            Back
          </button>
          
          <div className="flex gap-4">
            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all ${
                  !isStepValid() ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:translate-x-1'
                }`}
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => onGenerate(inputs)}
                disabled={isLoading}
                className="px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Generating Plan...
                  </>
                ) : (
                  <>Create My Study Plan</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerWizard;
