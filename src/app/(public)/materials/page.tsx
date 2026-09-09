'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FileText, Download, Search, BookOpen, Link as LinkIcon } from 'lucide-react';

interface Material {
  id: number;
  title: string;
  subject: string;
  grade: string;
  branch: string;
  teacherName: string;
  googleDriveLink: string;
  coverImage: string;
  downloads: number;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials');
      const data = await res.json();
      setMaterials(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (mat: Material) => {
    // Increment download count silently
    try {
      await fetch(`/api/materials/${mat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download' })
      });
      // Update local state to reflect UI change
      setMaterials(materials.map(m => m.id === mat.id ? { ...m, downloads: m.downloads + 1 } : m));
    } catch {}

    // Open Google Drive link
    window.open(mat.googleDriveLink, '_blank');
  };

  const filteredMaterials = materials.filter(m => 
    m.title.includes(searchTerm) || 
    m.subject.includes(searchTerm) || 
    m.grade.includes(searchTerm) ||
    m.teacherName.includes(searchTerm) ||
    (m.branch && m.branch.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative pb-20">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <div className="section-label mx-auto mb-4 w-fit">مجاناً للجميع</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            مكتبة <span className="gradient-text">الدوسيات والملفات</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            حمل الآن أقوى الدوسيات، الملخصات، وأوراق العمل المجهزة بعناية من نخبة أساتذة مركز القدومي.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-white/40" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن مادة، أستاذ، فرع أو صف..."
            className="w-full glass-dark border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 glass-dark rounded-3xl border border-white/5">
            <BookOpen className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">لا توجد ملفات مطابقة</h3>
            <p className="text-white/50">جرب البحث بكلمات أخرى</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map(mat => (
              <div key={mat.id} className="card-premium rounded-3xl flex flex-col h-full group hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-48 sm:h-56 w-full bg-white/5 border-b border-white/5">
                  {mat.coverImage ? (
                    <Image src={mat.coverImage} alt={mat.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-white/80 text-xs font-bold border border-white/10">
                    <Download className="w-3 h-3" />
                    {mat.downloads}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-primary-500/20 text-primary-300 border border-primary-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {mat.subject}
                    </span>
                    {mat.branch && mat.branch !== 'غير محدد' && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {mat.branch}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug">{mat.title}</h3>
                  
                  <div className="space-y-2 mb-6 text-sm text-white/60 flex-grow">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="font-medium text-white/80">الصف:</span> {mat.grade}
                    </div>
                    {mat.teacherName && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium text-white/80">الأستاذ:</span> {mat.teacherName}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleDownload(mat)}
                    className="mt-auto w-full btn-gold py-2.5 flex items-center justify-center gap-2 text-sm"
                  >
                    <LinkIcon className="w-4 h-4" />
                    عرض و تحميل الملف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
