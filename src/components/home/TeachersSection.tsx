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

const subjectColors: Record<string, { bg: string; text: string; glow: string }> = {
  'اللغة العربية': { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', glow: 'rgba(245,158,11,0.3)' },
  'الرياضيات':    { bg: 'from-blue-500/20 to-blue-600/10',   text: 'text-blue-400',  glow: 'rgba(59,130,246,0.3)' },
  'اللغة الإنجليزية': { bg: 'from-green-500/20 to-green-600/10', text: 'text-green-400', glow: 'rgba(34,197,94,0.3)' },
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
    <section className="py-16 lg:py-24 section-bg-light relative overflow-hidden" ref={ref}>
      {/* BG blobs */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-label mx-auto w-fit text-xs sm:text-sm">الكادر التعليمي</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-4 mb-4">
            أساتذتنا <span className="gradient-text">المتميزون</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-xl mx-auto">
            نخبة من الأساتذة المتخصصين ذوي الخبرة العالية يضمنون لك التفوق والنجاح
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teachers.map((teacher, i) => {
            const colors = subjectColors[teacher.subject] || { bg: 'from-purple-500/20 to-purple-600/10', text: 'text-purple-400', glow: 'rgba(168,85,247,0.3)' };
            return (
              <div key={teacher.id} className="teacher-card"
                style={{ transitionDelay: `${(i % 3) * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>

                {/* Image */}
                <div className="teacher-img-wrap h-56 sm:h-64 lg:h-[300px]">
                  {teacher.image ? (
                    <Image src={teacher.image} alt={teacher.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <GraduationCap className="w-16 h-16 sm:w-20 sm:h-20 text-white/20" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="teacher-img-overlay absolute inset-0" />

                  {/* Subject badge */}
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r ${colors.bg} backdrop-blur border border-white/10 text-xs sm:text-sm font-bold ${colors.text}`}>
                    {teacher.subject}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  {/* Name + rating */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                    <div>
                      <h3 className="text-white font-black text-lg sm:text-xl">أ. {teacher.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" fill="currentColor" />
                        ))}
                        <span className="text-white/40 text-[10px] sm:text-xs mr-1">ممتاز</span>
                      </div>
                    </div>
                  </div>

                  {/* Grades */}
                  <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                    {teacher.grades.split(',').map(g => (
                      <span key={g} className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/5 text-white/60 border border-white/8 whitespace-nowrap">
                        {g.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  {teacher.bio && (
                    <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 line-clamp-2">{teacher.bio}</p>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-white/5 mb-3 sm:mb-4" />

                  {/* Social links */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {teacher.whatsapp && (
                      <a href={whatsappLink(teacher.whatsapp, `أهلًا أستاذ ${teacher.name}، أود الاستفسار`)}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-[10px] sm:text-xs font-semibold">
                        <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" /> واتساب
                      </a>
                    )}
                    {teacher.phone && (
                      <a href={`tel:${teacher.phone}`}
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-[10px] sm:text-xs font-semibold">
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" /> اتصال
                      </a>
                    )}
                    {teacher.facebook && (
                      <a href={teacher.facebook} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-all text-[10px] sm:text-xs font-semibold">
                        <Facebook className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" /> فيسبوك
                      </a>
                    )}
                    {teacher.instagram && (
                      <a href={teacher.instagram} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 transition-all text-[10px] sm:text-xs font-semibold">
                        <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" /> إنستغرام
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link href="/teachers" className="btn-outline-white inline-flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto">
            <span>عرض جميع التفاصيل</span>
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
