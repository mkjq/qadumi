'use client';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Palette } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full p-1 shadow-sm backdrop-blur-md" style={{ direction: 'ltr' }}>
      <button 
        onClick={() => setTheme('light')} 
        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${theme === 'light' ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white'}`} 
        title="الوضع النهاري"
      >
        <Sun className="w-4 h-4" />
      </button>
      
      <button 
        onClick={() => setTheme('navy')} 
        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${theme === 'navy' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white'}`} 
        title="الوضع الكحلي (الأساسي)"
      >
        <Palette className="w-4 h-4" />
      </button>
      
      <button 
        onClick={() => setTheme('dark')} 
        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white'}`} 
        title="الوضع الليلي (الأسود)"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
