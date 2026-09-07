'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, CreditCard, UploadCloud, X, CheckCircle, ShieldCheck } from 'lucide-react';
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
    c.title.includes(search) || c.teacherName.includes(search) || c.subject.includes(search)
  );

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-primary-900 dark:text-white mb-4">متجر <span className="text-amber-500">البطاقات</span></h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">اشترِ بطاقات دورات ومكثفات نخبة الأساتذة بكل سهولة وسرعة</p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن بطاقة، مادة، أستاذ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-6 pr-14 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors shadow-sm text-lg"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20 text-gray-500">لا توجد بطاقات مطابقة لبحثك</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map(card => (
              <div key={card.id} className="bg-white dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-gray-200/20 dark:shadow-black/20 group flex flex-col">
                <div className="h-48 bg-gradient-to-br from-primary-900 to-primary-800 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-2">
                      {card.grade}
                    </span>
                    <h3 className="text-xl font-black text-white leading-tight">{card.title}</h3>
                  </div>
                  <div className="relative z-10 flex justify-between items-end">
                    <div className="text-white/80 font-medium text-sm">{card.teacherName}</div>
                    <div className="text-3xl font-black text-amber-400 drop-shadow-md">{card.price} <span className="text-sm">د.أ</span></div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium mb-6">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    تفعيل فوري وآمن
                  </div>
                  <button 
                    onClick={() => setSelectedCard(card)}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    شراء البطاقة
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

function CheckoutModal({ card, onClose }: { card: CourseCard, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '', phone: '', address: '', paymentMethod: 'CLIQ', receiptUrl: ''
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
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.paymentMethod === 'CLIQ' && !form.receiptUrl) {
      toast.error('يرجى إرفاق صورة وصل التحويل');
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
        setStep(3); // Success step
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-primary-900 rounded-[2rem] w-full max-w-xl shadow-2xl relative animate-fade-in-up my-auto">
        {step < 3 && (
          <button onClick={onClose} className="absolute top-6 left-6 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-8">
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">معلومات المشتري</h3>
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{card.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{card.teacherName}</div>
                </div>
                <div className="text-xl font-black text-amber-500">{card.price} د.أ</div>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الاسم الرباعي <span className="text-red-500">*</span></label>
                  <input required type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-amber-500" placeholder="اسمك الكامل" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف <span className="text-red-500">*</span></label>
                  <input required type="tel" dir="ltr" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-amber-500" placeholder="07XXXXXXXX" />
                </div>
                <button type="submit" className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl mt-6 transition-colors">
                  متابعة للدفع
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={submitOrder}>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">طريقة الدفع</h3>
              
              <div className="space-y-3 mb-8">
                <label className={`block cursor-pointer p-4 border-2 rounded-2xl transition-all ${form.paymentMethod === 'CLIQ' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="CLIQ" checked={form.paymentMethod === 'CLIQ'} onChange={() => setForm({...form, paymentMethod: 'CLIQ'})} className="w-5 h-5 text-amber-500" />
                    <span className="font-bold text-gray-900 dark:text-white">الدفع عبر كليك (CliQ)</span>
                  </div>
                </label>
                <label className={`block cursor-pointer p-4 border-2 rounded-2xl transition-all ${form.paymentMethod === 'DELIVERY' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="DELIVERY" checked={form.paymentMethod === 'DELIVERY'} onChange={() => setForm({...form, paymentMethod: 'DELIVERY'})} className="w-5 h-5 text-amber-500" />
                    <span className="font-bold text-gray-900 dark:text-white">الدفع عند التوصيل</span>
                  </div>
                </label>
              </div>

              {form.paymentMethod === 'CLIQ' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl mb-6 border border-blue-100 dark:border-blue-800/30">
                  <p className="text-blue-800 dark:text-blue-200 font-bold mb-2">تعليمات الدفع:</p>
                  <ol className="list-decimal list-inside text-sm text-blue-700 dark:text-blue-300 space-y-2 mb-4">
                    <li>قم بتحويل مبلغ <span className="font-bold">{card.price} د.أ</span></li>
                    <li>إلى الاسم المستعار (Alias): <span className="font-bold text-lg bg-white dark:bg-black/20 px-2 py-0.5 rounded">QADOUMI</span></li>
                    <li>قم بتصوير شاشة الدفع (وصل التحويل) وأرفقها هنا.</li>
                  </ol>
                  
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-white dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                        <p className="text-sm font-bold text-blue-600">{form.receiptUrl ? 'تم إرفاق الوصل بنجاح ✓' : 'اضغط لإرفاق صورة الوصل'}</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={uploadReceipt} disabled={loading} />
                    </label>
                  </div>
                </div>
              )}

              {form.paymentMethod === 'DELIVERY' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">العنوان التفصيلي للتوصيل <span className="text-red-500">*</span></label>
                  <textarea required value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-amber-500 resize-none" placeholder="المدينة، المنطقة، الشارع، أقرب معلم..." />
                  <p className="text-xs text-gray-500 mt-2">* يضاف رسوم توصيل تدفع للمندوب</p>
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white font-bold rounded-xl transition-colors">
                  رجوع
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center">
                  {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'تأكيد الطلب'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">تم استلام طلبك بنجاح!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                {form.paymentMethod === 'CLIQ' 
                  ? 'جاري التحقق من الحوالة المالية. سيصلك كود التفعيل عبر رسالة واتساب خلال وقت قصير.'
                  : 'سيقوم فريق الدعم بالتواصل معك لتأكيد موعد توصيل البطاقة لمنزلك.'}
              </p>
              <button onClick={onClose} className="px-8 py-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold rounded-xl transition-colors">
                إغلاق والعودة للمتجر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
