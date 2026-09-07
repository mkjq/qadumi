'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface CourseCard {
  id: number;
  title: string;
  subject: string;
  grade: string;
  teacherName: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
}

export default function CardsAdminPage() {
  const [cards, setCards] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<CourseCard | null>(null);
  const [search, setSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '', subject: '', grade: '', teacherName: '', price: '', imageUrl: '', isActive: true
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards?admin=true');
      const data = await res.json();
      setCards(data);
    } catch {
      toast.error('حدث خطأ أثناء جلب البطاقات');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCard ? `/api/cards/${editingCard.id}` : '/api/cards';
    const method = editingCard ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingCard ? 'تم التعديل بنجاح' : 'تمت الإضافة بنجاح');
        setShowModal(false);
        fetchCards();
      } else {
        toast.error('فشلت العملية');
      }
    } catch {
      toast.error('حدث خطأ في النظام');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه البطاقة؟')) return;
    try {
      const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم الحذف');
        fetchCards();
      }
    } catch {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const openModal = (card?: CourseCard) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        title: card.title, subject: card.subject, grade: card.grade,
        teacherName: card.teacherName, price: card.price.toString(),
        imageUrl: card.imageUrl || '', isActive: card.isActive
      });
    } else {
      setEditingCard(null);
      setFormData({ title: '', subject: '', grade: '', teacherName: '', price: '', imageUrl: '', isActive: true });
    }
    setShowModal(true);
  };

  const filteredCards = cards.filter(c => 
    c.title.includes(search) || c.teacherName.includes(search) || c.subject.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">متجر البطاقات</h1>
          <p className="text-gray-500">إدارة بطاقات الدورات المعروضة للبيع</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة بطاقة جديدة
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative max-w-md mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث عن بطاقة، أستاذ، أو مادة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-10">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                  <th className="pb-3 font-semibold">البطاقة</th>
                  <th className="pb-3 font-semibold">المادة / الصف</th>
                  <th className="pb-3 font-semibold">الأستاذ</th>
                  <th className="pb-3 font-semibold">السعر</th>
                  <th className="pb-3 font-semibold">الحالة</th>
                  <th className="pb-3 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50/50">
                    <td className="py-4 font-bold text-gray-900">{card.title}</td>
                    <td className="py-4 text-gray-600">{card.subject} - {card.grade}</td>
                    <td className="py-4 text-gray-600">{card.teacherName}</td>
                    <td className="py-4 font-bold text-primary-600">{card.price} د.أ</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${card.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {card.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(card)} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(card.id)} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">{editingCard ? 'تعديل البطاقة' : 'إضافة بطاقة جديدة'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدورة/البطاقة</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="مثال: مكثف الفيزياء" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الأستاذ</label>
                  <input required type="text" value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                  <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الصف</label>
                  <input required type="text" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="توجيهي، أول ثانوي..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر (بالدينار)</label>
                  <input required type="number" step="0.5" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div className="flex flex-col justify-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-primary-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">البطاقة متاحة للبيع</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button>
                <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
                  <Save className="w-5 h-5" /> حفظ البطاقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
