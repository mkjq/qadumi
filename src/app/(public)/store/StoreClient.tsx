'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, CreditCard, UploadCloud, X, CheckCircle, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

interface CourseCard {
  id: number;
  title: string;
  subject: string;
  grade: string;
  teacherName: string;
  price: number;
  imageUrl: string | null;
}

export default function StoreClient() {
  const [cards, setCards] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<CourseCard | null>(null);

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredCards = cards.filter(c => 
    c.title.includes(search) || c.teacherName.includes(search) || c.subject.includes(search) || c.grade.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50/70 font-arabic pb-24" dir="rtl">
      {/* ── 1. Hero Header ── */}
      <section className="relative bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-28 sm:pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-xs sm:text-sm font-bold mb-6 border border-amber-500/30">
            <Sparkles size={14} />
            <span>متجر بطاقات دورات ومكثفات التوجيهي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-white">
            متجر <span className="gradient-text-gold">البطاقات التعليمية</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            احصل على بطاقات دورات ومكثفات كبار الأساتذة مع تفعيل فوري وخيارات دفع مرنة
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="ابحث عن بطاقة، مادة، أستاذ أو صف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-navy-900 rounded-2xl py-4 pr-12 pl-4 shadow-lg border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm sm:text-base font-semibold transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── 2. Cards Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-slate-500 text-sm font-bold">جاري جلب البطاقات...</span>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 max-w-lg mx-auto p-8 shadow-sm">
            <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">لا توجد بطاقات مطابقة للبحث</h3>
            <p className="text-slate-400 text-sm">تأكد من كتابة اسم المادة أو المعلم بالشكل الصحيح</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-amber-400/80 group flex flex-col justify-between"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 p-6 flex flex-col justify-between relative overflow-hidden text-white min-h-[160px]">
                  <div className="absolute -right-8 -top-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-cyan-accent text-xs font-bold mb-2.5 border border-white/10">
                      {card.grade}
                    </span>
                    <h3 className="text-xl font-black text-white leading-snug group-hover:text-amber-400 transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  <div className="relative z-10 flex justify-between items-end pt-4 border-t border-white/10 mt-3">
                    <div className="text-slate-300 font-bold text-xs">أ. {card.teacherName}</div>
                    <div className="text-2xl font-black text-amber-400 drop-shadow">
                      {card.price} <span className="text-xs font-bold text-slate-200">د.أ</span>
                    </div>
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-6">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>بطاقة معتمدة مع تفعيل فوري</span>
                  </div>

                  <button
                    onClick={() => setSelectedCard(card)}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-navy-950 font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>طلب وشراء البطاقة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCard && (
        <CheckoutModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}

function CheckoutModal({ card, onClose }: { card: CourseCard; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'CLIQ',
    receiptUrl: '',
  });

  const uploadReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setForm({ ...form, receiptUrl: data.url });
      else toast.error('فشل رفع الصورة');
    } catch {
      toast.error('حدث خطأ أثناء الرفع');
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.paymentMethod === 'CLIQ' && !form.receiptUrl) {
      toast.error('يرجى إرفاق صورة إشعار أو وصل التحويل');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseCardId: card.id }),
      });
      if (res.ok) {
        setStep(3);
      } else {
        toast.error('فشل إرسال الطلب');
      }
    } catch {
      toast.error('حدث خطأ في النظام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative animate-fade-in-up my-auto max-h-[90vh] overflow-y-auto border border-slate-200">
        {step < 3 && (
          <button
            onClick={onClose}
            className="absolute top-5 left-5 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-black text-navy-900 mb-6">معلومات المشتري والتوصيل</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <div className="font-bold text-navy-900">{card.title}</div>
                  <div className="text-xs text-slate-600">أ. {card.teacherName} • {card.grade}</div>
                </div>
                <div className="text-xl font-black text-amber-600">{card.price} د.أ</div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                    الاسم الرباعي <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm font-medium"
                    placeholder="اسم الطالب الكامل"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                    رقم الهاتف (واتساب) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-sm font-medium text-right"
                    placeholder="07XXXXXXXX"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-navy-900 hover:bg-navy-800 text-white font-black rounded-xl mt-6 transition-all shadow-md"
                >
                  المتابعة لاختيار طريقة الدفع
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={submitOrder}>
              <h3 className="text-2xl font-black text-navy-900 mb-6">طريقة الدفع والتأكيد</h3>

              <div className="space-y-3 mb-8">
                <label
                  className={`block cursor-pointer p-4 border-2 rounded-2xl transition-all ${
                    form.paymentMethod === 'CLIQ'
                      ? 'border-amber-500 bg-amber-50/70'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="CLIQ"
                      checked={form.paymentMethod === 'CLIQ'}
                      onChange={() => setForm({ ...form, paymentMethod: 'CLIQ' })}
                      className="w-5 h-5 text-amber-500 accent-amber-500"
                    />
                    <span className="font-bold text-navy-900 text-sm sm:text-base">الدفع المباشر عبر كليك (CliQ)</span>
                  </div>
                </label>

                <label
                  className={`block cursor-pointer p-4 border-2 rounded-2xl transition-all ${
                    form.paymentMethod === 'DELIVERY'
                      ? 'border-amber-500 bg-amber-50/70'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="DELIVERY"
                      checked={form.paymentMethod === 'DELIVERY'}
                      onChange={() => setForm({ ...form, paymentMethod: 'DELIVERY' })}
                      className="w-5 h-5 text-amber-500 accent-amber-500"
                    />
                    <span className="font-bold text-navy-900 text-sm sm:text-base">الدفع نقداً عند التوصيل</span>
                  </div>
                </label>
              </div>

              {form.paymentMethod === 'CLIQ' && (
                <div className="bg-amber-50/80 p-5 rounded-2xl mb-6 border border-amber-200">
                  <p className="text-amber-900 font-bold mb-2 text-sm">تعليمات التحويل عبر CliQ:</p>
                  <ol className="list-decimal list-inside text-xs sm:text-sm text-amber-950 space-y-2 mb-4 leading-relaxed">
                    <li>قم بتحويل مبلغ <span className="font-black text-amber-700">{card.price} د.أ</span></li>
                    <li>
                      إلى الاسم المستعار (Alias):{' '}
                      <span className="font-black bg-white px-2 py-0.5 rounded border border-amber-300">QADOUMI</span>
                    </li>
                    <li>قم برفع صورة إشعار التحويل هنا لتأكيد طلبك فوراَ.</li>
                  </ol>

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-amber-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-amber-50/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-amber-500 mb-2" />
                      <p className="text-xs sm:text-sm font-bold text-amber-700">
                        {form.receiptUrl ? 'تم إرفاق الإشعار بنجاح ✓' : 'اضغط هنا لرفع صورة وصل التحويل'}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={uploadReceipt} disabled={loading} />
                  </label>
                </div>
              )}

              {form.paymentMethod === 'DELIVERY' && (
                <div className="mb-6">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                    عنوان التوصيل التفصيلي <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 resize-none text-sm"
                    placeholder="المدينة، المنطقة، الشارع، أقرب معلم معروف..."
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">* تضاف رسوم توصيل رمزية للمندوب عند الاستلام</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-navy-900 hover:bg-navy-800 text-white font-black rounded-xl transition-all flex justify-center items-center shadow-md text-sm"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'تأكيد وإرسال الطلب'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-navy-900 mb-3">تم استلام طلبك بنجاح!</h3>
              <p className="text-slate-600 mb-8 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                {form.paymentMethod === 'CLIQ'
                  ? 'جاري مراجعة إشعار التحويل. سنرسل لك كود التفعيل ورابط المادة عبر واتساب خلال دقائق.'
                  : 'سيقوم مندوب التوصيل بالتواصل معك هاتفياً لتسليم البطاقة في أقرب وقت.'}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl transition-all shadow-md text-sm"
              >
                إغلاق والعودة للمتجر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
