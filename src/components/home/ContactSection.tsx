'use client';
import { useState } from 'react';
import { Phone, MapPin, Clock, Facebook, MessageCircle, CheckCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ContactSectionProps { centerInfo: Record<string, string>; }

const contactItems = (phone: string, centerInfo: Record<string, string>) => [
  {
    icon: Phone, label: 'رقم الإدارة', value: phone, href: `tel:${phone}`,
    color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-500', iconBg: 'bg-amber-100/50'
  },
  {
    icon: MessageCircle, label: 'واتساب', value: 'تواصل مباشرة',
    href: whatsappLink(phone, 'أهلًا، أود الاستفسار عن المركز'),
    color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-600', iconBg: 'bg-green-100/50'
  },
  {
    icon: Clock, label: 'ساعات الدوام', value: '2:00 ظهرًا — 9:00 مساءً',
    href: null, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-500', iconBg: 'bg-blue-100/50'
  },
  {
    icon: MapPin, label: 'موقعنا', value: 'ضاحية الأمير حسن، عمّان',
    href: centerInfo.mapsUrl || '#',
    color: 'text-red-500', bg: 'bg-red-50', border: 'border-l-red-500', iconBg: 'bg-red-100/50'
  },
  {
    icon: Facebook, label: 'فيسبوك', value: 'صفحة المركز الرسمية',
    href: centerInfo.facebook || '#',
    color: 'text-[#1877F2]', bg: 'bg-[#1877F2]/10', border: 'border-l-[#1877F2]', iconBg: 'bg-[#1877F2]/20'
  },
];

export default function ContactSection({ centerInfo }: ContactSectionProps) {
  const phone = centerInfo.phone_admin || '0791586891';
  const [form, setForm] = useState({ name: '', phone: '', grade: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  // خاصية الاقتراحات للصف الدراسي
  const [showSuggestions, setShowSuggestions] = useState(false);
  const gradesList = ['التوجيهي', 'الأول ثانوي', 'العاشر', 'التاسع', 'الثامن', 'السابع', 'السادس', 'الخامس', 'الرابع', 'الثالث', 'الثاني', 'الأول'];
  
  // تصفية القائمة بناءً على ما يكتبه الطالب
  const filteredGrades = form.grade
    ? gradesList.filter(g => g.includes(form.grade) && g !== form.grade)
    : gradesList;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message || !form.grade || !form.phone) return;
    if (!/^07\d{8}$/.test(form.phone.trim())) {
      toast.error("يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 ويتكون من 10 أرقام");
      return;
    }
    setLoading(true);

    const waText = `أهلًا، أنا ${form.name}\nالصف: ${form.grade}\n\n${form.message}`;
    const waUrl = whatsappLink(phone, waText);

    try {
      await fetch('/api/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: form.name, 
          phone: form.phone, 
          message: `الصف: ${form.grade}\n\n${form.message}` 
        }),
      });
      
      setSent(true);
      toast.success('جاري تحويلك للواتساب...');
      window.open(waUrl, '_blank');
    } catch {
      toast.error('حدث خطأ، يرجى المحاولة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-slate-50/70 relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-black text-navy-900 mb-2 tracking-tight">
            نحن هنا <span className="gradient-text-cyan">لمساعدتك</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
            لأي استفسار أو للتسجيل في الدورات — تواصل مع فريق الإدارة بكل سهولة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Contact methods */}
          <div className="space-y-3 sm:space-y-4">
            {contactItems(phone, centerInfo).map((item, i) => {
              const el = (
                <div key={i} className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-slate-100 border-l-[4px] ${item.border} hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs sm:text-sm">{item.label}</p>
                    <p className={`font-bold text-navy-900 text-sm sm:text-base ${['رقم الإدارة', 'واتساب'].includes(item.label) ? 'ltr' : ''}`}>{item.value}</p>
                  </div>
                </div>
              );
              return item.href ? <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{el}</a> : el;
            })}
          </div>

          {/* Form */}
          <div className="card-white p-5 sm:p-8">
            <h3 className="text-navy-900 font-black text-lg sm:text-xl mb-4 sm:mb-6">أرسل لنا رسالة</h3>

            {sent ? (
              <div className="text-center py-8 sm:py-12 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
                <h4 className="text-navy-900 font-black text-lg sm:text-xl mb-2">تم التحويل للواتساب! 🎉</h4>
                <p className="text-slate-600 text-xs sm:text-sm">تم تجهيز رسالتك للإرسال مباشرة للإدارة</p>
                <button onClick={() => setSent(false)} className="mt-4 sm:mt-6 text-cyan-accent hover:text-cyan-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto">
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-medium text-xs sm:text-sm mb-1.5 block">الاسم <span className="text-red-500">*</span></label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="الاسم الثلاثي" required className="input-clean" />
                  </div>
                  
                  {/* Grade Autocomplete Field */}
                  <div className="relative">
                    <label className="text-slate-700 font-medium text-xs sm:text-sm mb-1.5 block">الصف الدراسي <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={form.grade} 
                      onChange={e => {
                        setForm({ ...form, grade: e.target.value });
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setShowSuggestions(false)}
                      placeholder="مثال: التوجيهي، العاشر..." 
                      required 
                      className="input-clean" 
                      autoComplete="off"
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredGrades.length > 0 && (
                      <div className="suggestions-dropdown absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {filteredGrades.map(g => (
                          <div 
                            key={g}
                            onMouseDown={(e) => {
                              // استخدام onMouseDown لتنفيذ الكود قبل فقدان التركيز (onBlur)
                              e.preventDefault();
                              setForm({ ...form, grade: g });
                              setShowSuggestions(false);
                            }}
                            className="px-4 py-3 text-sm text-slate-700 hover:text-cyan-accent hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 font-medium"
                          >
                            {g}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-medium text-xs sm:text-sm mb-1.5 block">رقم الهاتف <span className="text-red-500">*</span></label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="07xxxxxxxx" required className="input-clean ltr text-right" dir="ltr" />
                </div>
                <div>
                  <label className="text-slate-700 font-medium text-xs sm:text-sm mb-1.5 block">رسالتك <span className="text-red-500">*</span></label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="اكتب رسالتك أو استفساراتك هنا..." required rows={3}
                    className="input-clean resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-cyan w-full flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base py-3.5 mt-2">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><MessageCircle className="w-5 h-5" /><span>المراسلة عبر واتساب</span></>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm h-72 sm:h-80 relative z-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3382.8!2d35.8947!3d31.9773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca15be5a28ba9%3A0x0!2zMjDZiNmBINmF2LHZg9myINin2YTZgtin2K/ZiNmF2Ys!5e0!3m2!1sar!2sjo!4v1234567890"
            width="100%" height="100%" style={{ border: 0 }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="موقع مركز القدومي"
          />
        </div>
      </div>
    </section>
  );
}
