'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, Quote, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  name: string;
  userType: string;
  content: string;
  rating: number;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [form, setForm] = useState({ name: '', userType: 'طالب', content: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) return;
    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('تم إرسال تقييمك للمراجعة. شكراً لك!');
        setShowForm(false);
        setForm({ name: '', userType: 'طالب', content: '', rating: 5 });
      }
    } catch {
      toast.error('حدث خطأ أثناء الإرسال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-slate-50 relative overflow-hidden font-arabic">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
          <div className="text-center md:text-right">
            <h2 className="text-2xl sm:text-4xl font-black text-navy-900 mb-1.5 sm:mb-3 leading-tight">
              ماذا يقولون <span className="text-cyan-500">عنّا؟</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
              نفخر بثقة طلابنا وأهاليهم، ونعتز بكل كلمة صادقة كُتبت في حقنا ومسيرتنا التعليمية.
            </p>
          </div>
          
          <button 
            onClick={() => setShowForm(true)}
            className="btn-cyan whitespace-nowrap flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base hover:-translate-y-1 transition-all shadow-lg hover:shadow-cyan-accent/20 w-full sm:w-auto"
          >
            <MessageSquare className="w-5 h-5" />
            أضف تقييمك
          </button>
        </div>

        {/* Marquee Container */}
        {reviews.length > 0 ? (
          <div className="relative flex overflow-hidden group py-4 sm:py-6">
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex w-max">
              {/* Generate enough items to fill the screen */}
              {[1, 2].map((trackIdx) => (
                <div 
                  key={trackIdx} 
                  className="flex animate-marquee group-hover:[animation-play-state:paused] gap-4 sm:gap-6 pl-4 sm:pl-6 min-w-max"
                  style={{ animationDuration: '40s' }}
                  aria-hidden={trackIdx === 2}
                >
                  {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
                    <div 
                      key={`${trackIdx}-${review.id}-${idx}`} 
                      className="review-card bg-white w-[260px] sm:w-[380px] flex-shrink-0 rounded-2xl sm:rounded-3xl p-5 sm:p-7 relative transition-all duration-300 hover:-translate-y-1 group/card flex flex-col shadow-md hover:shadow-xl border border-slate-100 overflow-hidden"
                    >
                      {/* Colorful Top Accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                      
                      <Quote className="absolute top-4 left-4 sm:top-5 sm:left-5 w-12 h-12 sm:w-16 sm:h-16 rotate-180 text-slate-50 group-hover/card:text-cyan-50 transition-colors duration-500 -z-0" />
                      
                      <div className="relative z-10 flex flex-col flex-grow">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? 'text-gold-400 fill-gold-400' : 'text-slate-200 fill-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-navy-700 text-sm sm:text-base leading-relaxed mb-4 font-medium line-clamp-4 relative text-right">
                          "{review.content}"
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 relative z-10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-50 to-blue-50 text-blue-600 flex items-center justify-center font-black text-base sm:text-lg flex-shrink-0 border border-slate-100 shadow-sm">
                          {review.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden text-right">
                          <div className="font-bold text-navy-900 text-sm sm:text-base truncate">{review.name}</div>
                          <div className="text-cyan-600 text-xs sm:text-sm font-semibold mt-0.5">{review.userType}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-base sm:text-lg">كن أول من يكتب تقييماً للمركز!</p>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
          <div className="review-modal bg-white border border-slate-100 rounded-[2rem] w-full max-w-lg p-6 sm:p-8 relative shadow-2xl animate-fade-in-up">
            
            <button 
              onClick={() => setShowForm(false)} 
              className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 text-slate-400 hover:text-navy-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black text-navy-900 mb-2 flex items-center gap-2">
                رأيك يهمنا
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400 fill-gold-400" />
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8">سيتم مراجعة تقييمك من قبل الإدارة قبل نشره في الموقع لضمان المصداقية.</p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Star Rating */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 bg-slate-50 py-3 sm:py-4 rounded-2xl border border-slate-100">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${form.rating >= star ? 'text-gold-400 fill-gold-400 drop-shadow-[0_0_8px_rgba(255,184,0,0.3)]' : 'text-slate-200 fill-slate-200'}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <label className={`cursor-pointer flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl border transition-all ${form.userType === 'طالب' ? 'bg-cyan-accent/10 border-cyan-accent/30 text-cyan-accent' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" name="userType" value="طالب" checked={form.userType === 'طالب'} onChange={() => setForm({...form, userType: 'طالب'})} className="hidden" />
                    <span className="font-bold text-xs sm:text-sm">أنا طالب</span>
                  </label>
                  <label className={`cursor-pointer flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl border transition-all ${form.userType === 'ولي أمر' ? 'bg-cyan-accent/10 border-cyan-accent/30 text-cyan-accent' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" name="userType" value="ولي أمر" checked={form.userType === 'ولي أمر'} onChange={() => setForm({...form, userType: 'ولي أمر'})} className="hidden" />
                    <span className="font-bold text-xs sm:text-sm">أنا ولي أمر</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-navy-700 mb-1.5 sm:mb-2 font-medium">الاسم الكامل <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="اسمك (سيظهر للعامة)"
                    className="input-clean text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-navy-700 mb-1.5 sm:mb-2 font-medium">التقييم أو الرأي <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={4}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="اكتب تجربتك ورأيك بصدق..."
                    className="input-clean resize-none text-sm sm:text-base"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-cyan py-3 sm:py-4 text-sm sm:text-base font-bold rounded-xl mt-4 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    'إرسال التقييم'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
