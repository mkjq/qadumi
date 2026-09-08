import { prisma } from '@/lib/db';
import Image from 'next/image';
import { Phone, Facebook, Instagram, MessageCircle, GraduationCap } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أساتذتنا | مركز القدومي الثقافي',
  description: 'تعرف على نخبة أساتذة مركز القدومي الثقافي المتخصصين',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="relative w-24 h-24 mx-auto mb-6 bg-white/10 rounded-2xl p-2 backdrop-blur border border-white/20">
            <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain rounded-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">أساتذتنا المتميزون</h1>
          <p className="text-xl text-white/80">
            نخبة من المعلمين المتخصصين ذوي الخبرة العالية
          </p>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="card group overflow-visible">
                {/* Image */}
                <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                  {teacher.image ? (
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100">
                      <GraduationCap className="w-20 h-20 text-primary-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4">
                    <h2 className="text-xl font-bold text-white">أ. {teacher.name}</h2>
                    <p className="text-gold-300 font-medium text-sm">{teacher.subject}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Grades */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.grades.split(',').map((grade) => (
                      <span
                        key={grade}
                        className="bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-medium border border-primary-100"
                      >
                        {grade.trim()}
                      </span>
                    ))}
                  </div>

                  {teacher.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {teacher.bio}
                    </p>
                  )}

                  {/* Phone */}
                  {teacher.phone && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary-600" />
                      <a href={`tel:${teacher.phone}`} className="text-primary-700 font-semibold ltr hover:text-primary-900">
                        {teacher.phone}
                      </a>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-2">
                    {teacher.whatsapp && (
                      <a
                        href={whatsappLink(teacher.whatsapp, `أهلًا أستاذ ${teacher.name}، أود الاستفسار`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        واتساب
                      </a>
                    )}
                    {teacher.facebook && (
                      <a
                        href={teacher.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        فيسبوك
                      </a>
                    )}
                    {teacher.instagram && (
                      <a
                        href={teacher.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        إنستغرام
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {teachers.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>سيتم إضافة الأساتذة قريبًا</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
