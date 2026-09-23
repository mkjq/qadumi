'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FileText, Download, Search, BookOpen, Star, GraduationCap, CheckCircle } from 'lucide-react';

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
  const [selectedSubject, setSelectedSubject] = useState('الكل');

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
    try {
      await fetch(`/api/materials/${mat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download' })
      });
      setMaterials(materials.map(m => m.id === mat.id ? { ...m, downloads: m.downloads + 1 } : m));
    } catch {}

    window.open(mat.googleDriveLink, '_blank');
  };

  const subjects = ['الكل', ...Array.from(new Set(materials.map(m => m.subject).filter(Boolean)))];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = 
      m.title.includes(searchTerm) || 
      m.subject.includes(searchTerm) || 
      m.grade.includes(searchTerm) ||
      m.teacherName.includes(searchTerm) ||
      (m.branch && m.branch.includes(searchTerm));
    
    const matchesSubject = selectedSubject === 'الكل' || m.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] text-white font-arabic pb-24" dir="rtl">
      {/* ── 1. Hero Header ── */}
      <section className="relative bg-transparent text-white pt-28 sm:pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-xs sm:text-sm font-bold mb-6 border border-amber-500/30">
            <Star size={14} />
            <span>متاحة مجاناً لجميع أبنائنا الطلبة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-white">
            مكتبة <span className="gradient-text-gold">الدوسيات والملخصات</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            حمّل الآن أقوى الدوسيات وأوراق العمل والامتحانات المقترحة المعدّة بعناية من كبار أساتذة مركز القدومي
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم المادة، الأستاذ، الفرع أو الصف..."
              className="w-full bg-white/5 text-white rounded-2xl py-4 pr-12 pl-4 shadow-lg border border-white/10 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm sm:text-base font-semibold transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── 2. Filters & Materials Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        {/* Subject Filter Pills */}
        {subjects.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                  selectedSubject === sub
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:border-amber-400'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-slate-300 text-sm font-bold">جاري جلب الملفات...</span>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-slate-300 max-w-lg mx-auto p-8 shadow-sm">
            <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">لا توجد ملفات مطابقة للبحث</h3>
            <p className="text-slate-400 text-sm">جرب البحث بكلمات أخرى أو اختر مادة دراسية مختلفة</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white/5 rounded-3xl border border-white/10 shadow-sm hover:shadow-md hover:border-amber-400/80 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Cover Image or Icon */}
                <div className="relative h-48 w-full bg-white/5 border-b border-white/10 flex items-center justify-center overflow-hidden">
                  {mat.coverImage ? (
                    <Image
                      src={mat.coverImage}
                      alt={mat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                      <FileText size={32} />
                    </div>
                  )}

                  {mat.downloads > 0 && (
                    <div className="absolute top-3 left-3 bg-cyan-500/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-[11px] font-bold">
                      <Download size={12} className="text-amber-400" />
                      <span>{mat.downloads}</span>
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="bg-cyan-accent-50 text-cyan-accent-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {mat.subject}
                      </span>
                      <span className="bg-white/5 text-slate-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {mat.grade}
                      </span>
                      {mat.branch && mat.branch !== 'غير محدد' && (
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {mat.branch}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-cyan-accent transition-colors">
                      {mat.title}
                    </h3>

                    <p className="text-slate-300 text-xs mb-4">
                      إعداد الأستاذ: <span className="font-bold text-white">{mat.teacherName}</span>
                    </p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(mat)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-navy-950 text-white font-bold text-xs shadow-sm hover:shadow transition-all"
                  >
                    <Download size={14} />
                    <span>تحميل عبر Google Drive</span>
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
