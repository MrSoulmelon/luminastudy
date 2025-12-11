
import React, { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle2, Loader2, FileType } from 'lucide-react';
import { parseFileToText } from '../utils/fileParser';

interface FileDropzoneProps {
  onFileParsed: (text: string) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile) return;
    
    // Size check: 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB.");
      return;
    }

    setFile(selectedFile);
    setStatus('parsing');
    setProgress(20);

    try {
      // Simulate progress for UX
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const text = await parseFileToText(selectedFile);
      
      clearInterval(timer);
      setProgress(100);
      setStatus('success');
      onFileParsed(text);
    } catch (err) {
      console.error(err);
      setStatus('error');
      alert("Error parsing file. Ensure it is a valid PDF, DOCX, or TXT.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setStatus('idle');
    setProgress(0);
    onFileParsed('');
  };

  return (
    <div 
      className={`relative w-full h-48 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden ${
        isDragging 
          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' 
          : 'border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 hover:border-gray-300 dark:hover:border-slate-700'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input 
        id="file-input" type="file" className="hidden" 
        accept=".pdf,.docx,.txt" onChange={handleFileInput} 
      />

      {status === 'idle' && (
        <>
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-primary-500" />
          </div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Drop syllabus here or click to upload</p>
          <p className="text-xs text-gray-500 mt-1">Supports PDF, DOCX, TXT (Max 10MB)</p>
        </>
      )}

      {status === 'parsing' && (
        <div className="w-full max-w-xs space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Parsing {file?.name}...</p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{file?.name}</p>
          <button 
            onClick={reset}
            className="mt-2 text-xs font-semibold text-gray-500 hover:text-red-500 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove file
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center text-red-500">
          <FileType className="w-10 h-10 mb-2" />
          <p className="text-sm font-bold">Error Processing File</p>
          <button onClick={reset} className="mt-2 text-xs underline">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
