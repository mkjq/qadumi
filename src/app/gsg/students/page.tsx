'use client';

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Save, Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (e) {
      console.error('Error loading students:', e);
      toast.error('حدث خطأ أثناء تحميل بيانات الطلاب');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟')) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم الحذف بنجاح');
        loadStudents();
      } else {
        toast.error('حدث خطأ أثناء الحذف');
      }
    } catch (e) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent({ ...student });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent),
      });

      if (res.ok) {
        toast.success('تم الحفظ بنجاح');
        setShowForm(false);
        loadStudents();
      } else {
        toast.error('حدث خطأ أثناء الحفظ');
      }
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
          <h1 className="text-2xl font-bold text-gray-800">إدارة الطلاب والنقاط</h1>
          <p className="text-gray-500 text-sm mt-1">يمكنك تعديل نقاط ومستويات الطلاب من هنا ({students.length} طالب)</p>
        </div>
        <button
          onClick={loadStudents}
          className="flex items-center gap-2 text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>تحديث</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">تعديل بيانات الطالب: {editingStudent?.name}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-rose-500">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رصيد النقاط</label>
                <input required type="number" min="0" value={editingStudent?.points ?? ''} onChange={(e) => setEditingStudent({...editingStudent, points: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">المستوى (اللقب)</label>
                <input required type="text" value={editingStudent?.level ?? ''} onChange={(e) => setEditingStudent({...editingStudent, level: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الصف الأكاديمي</label>
                <input required type="text" value={editingStudent?.grade ?? ''} onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div className="flex items-center gap-3 mt-8">
                <input type="checkbox" checked={editingStudent?.isActive ?? true} onChange={(e) => setEditingStudent({...editingStudent, isActive: e.target.checked})} className="w-5 h-5 rounded accent-gray-900" id="isActive" />
                <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">حساب مفعل</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100">
                إلغاء
              </button>
              <button type="submit" disabled={saving} className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2">
                <Save size={18} />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">الاسم</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">رقم الهاتف</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">الصف</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">المستوى</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">النقاط</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">جاري التحميل...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users size={40} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-bold">لا يوجد طلاب مسجلين حالياً</p>
                    </td>
                  </tr>
                ) : students.map((student) => (
                  <tr key={student.id} className={`hover:bg-gray-50 transition ${!student.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 font-bold text-gray-800">{student.name}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{student.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{student.grade}</td>
                    <td className="px-6 py-4">
                      <span className="bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-md text-xs font-bold border border-cyan-200">
                        {student.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-200 flex items-center gap-1 w-max">
                        🏆 {student.points}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(student)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition" title="تعديل"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(student.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="حذف"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
