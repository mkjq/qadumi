'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Plus, Edit, Trash2, X, Save, Gift, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRewards, saveReward, deleteReward } from './actions';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = () => {
    startTransition(async () => {
      const data = await getRewards();
      setRewards(data);
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المكافأة؟')) return;
    try {
      await deleteReward(id);
      toast.success('تم الحذف بنجاح');
      loadRewards();
    } catch (e) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const handleEdit = (reward: any) => {
    setEditingReward({ ...reward });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingReward({
      title: '',
      description: '',
      pointsCost: 500,
      icon: '🎁',
      isActive: true
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveReward(editingReward);
      toast.success('تم الحفظ بنجاح');
      setShowForm(false);
      loadRewards();
    } catch (e) {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة المكافآت</h1>
          <p className="text-gray-500 text-sm mt-1">أضف مكافآت جديدة للطلاب ليستبدلوها بنقاطهم</p>
        </div>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition"
          >
            <Plus size={18} />
            <span>إضافة مكافأة</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">{editingReward?.id ? 'تعديل المكافأة' : 'إضافة مكافأة'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-rose-500">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم المكافأة</label>
                <input required type="text" value={editingReward?.title} onChange={(e) => setEditingReward({...editingReward, title: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">التكلفة (نقاط)</label>
                <input required type="number" min="1" value={editingReward?.pointsCost} onChange={(e) => setEditingReward({...editingReward, pointsCost: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                <input type="text" value={editingReward?.description || ''} onChange={(e) => setEditingReward({...editingReward, description: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الأيقونة (إيموجي)</label>
                <input type="text" value={editingReward?.icon || ''} onChange={(e) => setEditingReward({...editingReward, icon: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none text-2xl text-center" />
              </div>
              <div className="flex items-center gap-3 mt-8">
                <input type="checkbox" checked={editingReward?.isActive} onChange={(e) => setEditingReward({...editingReward, isActive: e.target.checked})} className="w-5 h-5 rounded accent-gray-900" id="isActive" />
                <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">متاح للطلاب</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100">
                إلغاء
              </button>
              <button type="submit" disabled={saving} className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2">
                <Save size={18} />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ المكافأة'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isPending ? (
            <p className="text-gray-500 p-8 text-center col-span-full">جاري التحميل...</p>
          ) : rewards.map((reward) => (
            <div key={reward.id} className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${!reward.isActive ? 'opacity-60 border-gray-200' : 'border-amber-200'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl">{reward.icon || '🎁'}</div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(reward)} className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(reward.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">{reward.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{reward.description}</p>
              
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200">
                <span>🏆</span>
                <span>{reward.pointsCost} نقطة</span>
              </div>
            </div>
          ))}
          {!isPending && rewards.length === 0 && (
             <div className="col-span-full text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
               <Gift size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-500 font-bold">لا يوجد مكافآت حالياً. أضف مكافأة جديدة!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
