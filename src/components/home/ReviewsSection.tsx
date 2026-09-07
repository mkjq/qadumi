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
    <section className="py-20 lg:py-32 bg-[#0a0e1a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-500/10 to-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 sm:mb-20 gap-8">
          <div className="text-center md:text-right">
            <div className="section-label mx-auto md:mx-0 w-fit text-xs sm:text-sm">قصص نجاح وثقة مستمرة</div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-4 mb-4 leading-tight">
              ماذا يقولون <span className="gradient-text">عنا؟</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-xl leading-relaxed">
              نفخر بثقة طلابنا وأهاليهم، ونعتز بكل كلمة صادقة كُتبت في حقنا. انضم لآلاف الطلاب الناجحين بفضل الله.
            </p>
          </div>
          
          <button 
            onClick={() => setShowForm(true)}
            className="btn-outline-white whitespace-nowrap flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base hover:bg-white hover:text-[#0a0e1a] transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            أضف تقييمك
          </button>
        </div>

        {/* Marquee Container */}
        {reviews.length > 0 ? (
          <div className="relative flex overflow-hidden group py-10 -my-10">
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#0a0e1a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#0a0e1a] to-transparent z-10 pointer-events-none" />

            <div className="flex w-max">
              {/* Generate enough items to fill the screen */}
              {[1, 2].map((trackIdx) => (
                <div 
                  key={trackIdx} 
                  className="flex animate-marquee group-hover:[animation-play-state:paused] gap-6 sm:gap-8 pl-6 sm:pl-8 min-w-max"
                  aria-hidden={trackIdx === 2}
                >
                  {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
                    <div key={`${trackIdx}-${review.id}-${idx}`} className="w-[320px] sm:w-[420px] flex-shrink-0 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-amber-500/30 rounded-3xl p-8 relative transition-all duration-300 hover:-translate-y-2 shadow-2xl shadow-black/20 group/card flex flex-col justify-between h-full min-h-[280px]">
                      <Quote className="absolute top-8 left-8 w-12 h-12 text-amber-500/10 rotate-180 group-hover/card:text-amber-500/20 transition-colors" />
                      
                      <div>
                        <div className="flex items-center gap-1.5 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' : 'text-white/10'}`} />
                          ))}
                        </div>
                        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 relative z-10 line-clamp-4 font-medium">
                          "{review.content}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-white shadow-lg text-lg flex-shrink-0">
                          {review.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-white text-base truncate">{review.name}</div>
                          <div className="text-amber-400/80 text-sm font-medium mt-0.5">{review.userType}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-3xl glass-dark">
            <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">كن أول من يكتب تقييماً للمركز!</p>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#0a0e1a] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 relative shadow-2xl animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[2rem] pointer-events-none" />
            
            <button 
              onClick={() => setShowForm(false)} 
              className="absolute top-6 left-6 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                رأيك يهمنا
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-white/50 text-sm mb-8">سيتم مراجعة تقييمك من قبل الإدارة قبل نشره في الموقع لضمان المصداقية.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star Rating */}
                <div className="flex items-center justify-center gap-3 mb-8 bg-white/5 py-4 rounded-2xl border border-white/5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star className={`w-10 h-10 ${form.rating >= star ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'text-white/10'}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <label className={`cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${form.userType === 'طالب' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                    <input type="radio" name="userType" value="طالب" checked={form.userType === 'طالب'} onChange={() => setForm({...form, userType: 'طالب'})} className="hidden" />
                    <span className="font-bold text-sm">أنا طالب</span>
                  </label>
                  <label className={`cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${form.userType === 'ولي أمر' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                    <input type="radio" name="userType" value="ولي أمر" checked={form.userType === 'ولي أمر'} onChange={() => setForm({...form, userType: 'ولي أمر'})} className="hidden" />
                    <span className="font-bold text-sm">أنا ولي أمر</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">الاسم الكامل <span className="text-red-400">*</span></label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="اسمك (سيظهر للعامة)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">التقييم أو الرأي <span className="text-red-400">*</span></label>
                  <textarea
                    required
                    rows={4}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="اكتب تجربتك ورأيك بصدق..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-4 text-base font-bold rounded-xl mt-6 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
