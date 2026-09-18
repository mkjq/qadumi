'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Facebook, Instagram, MessageCircle, ChevronLeft, Star, GraduationCap } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

interface Teacher {
  id: number; name: string; subject: string; grades: string;
  phone: string | null; whatsapp: string | null; facebook: string | null;
  instagram: string | null; bio: string | null; image: string | null;
}

const subjectColors: Record<string, { bg: string; text: string }> = {
  'اللغة العربية': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'الرياضيات': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'اللغة الإنجليزية': { bg: 'bg-green-100', text: 'text-green-700' },
};

export default function TeachersSection({ teachers }: { teachers: Teacher[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 lg:py-28 bg-white relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="section-label mx-auto w-fit text-xs sm:text-sm mb-4">
            الكادر التعليمي
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4 tracking-tight">
            أساتذتنا <span className="gradient-text-cyan">المتميزون</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
            نخبة من الأساتذة المتخصصين ذوي الخبرة العالية يضمنون لك التفوق والنجاح
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teachers.map((teacher, i) => {
            const colors = subjectColors[teacher.subject] || { bg: 'bg-purple-100', text: 'text-purple-700' };
            return (
              <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                style={{ transitionDelay: `${(i % 3) * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>

                {/* Image */}
                <div className="relative h-56 sm:h-64 lg:h-72 w-full bg-slate-50">
                  {teacher.image ? (
                    <Image src={teacher.image} alt={teacher.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <GraduationCap className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, white 0%, rgba(255,255,255,0.2) 40%, transparent 100%)' }} />

                  {/* Subject badge */}
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs sm:text-sm font-bold shadow-sm`}>
                    {teacher.subject}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col relative z-10 -mt-6">
                  {/* Name + rating */}
                  <div className="flex flex-col mb-3">
                    <h3 className="text-[#0B1D3A] font-black text-lg sm:text-xl">أ. {teacher.name}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-[#FFB800]" fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  {/* Grades */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.grades.split(',').map(g => (
                      <span key={g} className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
                        {g.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  {teacher.bio && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-2 flex-1">{teacher.bio}</p>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-slate-100 w-full my-4" />

                  {/* Social links */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {teacher.whatsapp && (
                      <a href={whatsappLink(teacher.whatsapp, `أهلًا أستاذ ${teacher.name}، أود الاستفسار`)}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-xs font-semibold">
                        <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" /> واتساب
                      </a>
                    )}
                    {teacher.phone && (
                      <a href={`tel:${teacher.phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-semibold">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" /> اتصال
                      </a>
                    )}
                    {teacher.facebook && (
                      <a href={teacher.facebook} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-semibold">
                        <Facebook className="w-3.5 h-3.5 flex-shrink-0" /> فيسبوك
                      </a>
                    )}
                    {teacher.instagram && (
                      <a href={teacher.instagram} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors text-xs font-semibold">
                        <Instagram className="w-3.5 h-3.5 flex-shrink-0" /> إنستغرام
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Link href="/teachers" className="inline-flex items-center justify-center gap-2 text-sm sm:text-base bg-cyan-accent hover:bg-cyan-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-cyan-accent/20 hover:shadow-cyan-accent/30 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
            <span>عرض جميع المعلمين والتفاصيل</span>
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
