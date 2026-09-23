const fs = require('fs');
let content = fs.readFileSync('src/app/(public)/about/page.tsx', 'utf8');

content = content.replaceAll('text-navy-900', 'text-white');
content = content.replaceAll('text-slate-600', 'text-slate-300');

content = content.replace('<div className=\"max-w-4xl mx-auto relative z-10\">', '<div className=\"max-w-4xl mx-auto relative z-10 animate-fade-in-up\">');

content = content.replace(/bg-white\\/5 rounded-2xl p-6 text-center border border-white\\/10 shadow-sm hover:border-amber-400\\/60 transition-all/g, 'bg-white/5 rounded-2xl p-6 text-center border border-white/10 shadow-sm hover:border-cyan-400/60 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 animate-fade-in-up');

content = content.replace(/bg-white\\/5 rounded-3xl p-7 border border-white\\/10 shadow-sm hover:shadow-md hover:border-amber-400 transition-all text-center/g, 'bg-white/5 rounded-3xl p-7 border border-white/10 shadow-sm hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-2 hover:border-amber-400 transition-all duration-300 animate-fade-in-up');

content = content.replace(/bg-white\\/5 rounded-3xl p-8 sm:p-12 border border-white\\/10 shadow-sm mb-16/g, 'bg-white/5 rounded-3xl p-8 sm:p-12 border border-white/10 shadow-sm mb-16 hover:bg-white/10 transition-colors duration-500 animate-fade-in-up');

content = content.replace(/bg-white\\/5 rounded-3xl p-8 sm:p-12 border border-white\\/10 shadow-sm mb-20/g, 'bg-white/5 rounded-3xl p-8 sm:p-12 border border-white/10 shadow-sm mb-20 hover:border-amber-500/30 transition-colors duration-500 animate-fade-in-up');

content = content.replaceAll('<div key={i} className=\"relative\">', '<div key={i} className=\"relative group hover:scale-[1.02] transition-transform duration-300\">');
content = content.replaceAll('<div className=\"absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow\" />', '<div className=\"absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow group-hover:scale-125 transition-transform duration-300\" />');

fs.writeFileSync('src/app/(public)/about/page.tsx', content);
console.log('Fixed');
