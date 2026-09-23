'use client';

import { useEffect, useState } from 'react';
import { Trash2, CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  name: string;
  userType: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?admin=true');
      const data = await res.json();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: !currentStatus } : r));
        toast.success(currentStatus ? 'تم إخفاء التقييم' : 'تم قبول التقييم وسيظهر في الموقع');
      }
    } catch {
      toast.error('حدث خطأ');
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== id));
      toast.success('تم الحذف');
    } catch {
      toast.error('فشل الحذف');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة التقييمات وآراء الطلاب</h1>
        <p className="text-gray-500 text-sm mt-1">
          وافق على التقييمات الإيجابية لتظهر في الصفحة الرئيسية للموقع
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">لا يوجد تقييمات حتى الآن</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map(review => (
            <div key={review.id} className={`bg-white rounded-2xl p-5 shadow-sm border-r-4 ${review.isApproved ? 'border-green-500' : 'border-amber-500'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-gray-900">{review.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{review.userType}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${review.isApproved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {review.isApproved ? 'مقبول (معروض)' : 'بانتظار الموافقة'}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toggleApproval(review.id, review.isApproved)} className={`p-2 rounded-xl transition-colors ${review.isApproved ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`} title={review.isApproved ? 'إخفاء' : 'قبول'}>
                    {review.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteReview(review.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
