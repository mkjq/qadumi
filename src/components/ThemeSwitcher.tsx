'use client';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Palette } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-full p-1" style={{ direction: 'ltr' }}>
      <button 
        onClick={() => setTheme('light')} 
        className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-amber-400 text-amber-900' : 'text-white/50 hover:text-white'}`} 
        title="الوضع النهاري"
      >
        <Sun className="w-4 h-4" />
      </button>
      
      <button 
        onClick={() => setTheme('navy')} 
        className={`p-1.5 rounded-full transition-all ${theme === 'navy' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`} 
        title="الوضع الكحلي (الأساسي)"
      >
        <Palette className="w-4 h-4" />
      </button>
      
      <button 
        onClick={() => setTheme('dark')} 
        className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-white/50 hover:text-white'}`} 
        title="الوضع الليلي (الأسود)"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
