'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, X, Save, Upload, FileText, Download, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Material {
  id?: number;
  title: string;
  subject: string;
  grade: string;
  branch: string;
  teacherName: string;
  googleDriveLink: string;
  coverImage: string;
  downloads: number;
  isActive: boolean;
}

const emptyMaterial: Material = {
  title: '', subject: '', grade: '', branch: 'أكاديمي', teacherName: '', googleDriveLink: '', coverImage: '', downloads: 0, isActive: true
};

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMat, setEditingMat] = useState<Material>(emptyMaterial);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials?admin=true');
      const data = await res.json();
      setMaterials(data);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setEditingMat({ ...editingMat, coverImage: data.url });
        toast.success('تم رفع الغلاف بنجاح');
      } else {
        toast.error('فشل رفع الغلاف');
      }
    } catch {
      toast.error('حدث خطأ أثناء الرفع');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!editingMat.title || !editingMat.subject || !editingMat.googleDriveLink) {
      toast.error('العنوان، المادة، ورابط جوجل درايف مطلوبة');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/materials/${editingMat.id}` : '/api/materials';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMat),
      });

      if (res.ok) {
        toast.success(isEditing ? 'تم التحديث' : 'تمت الإضافة');
        setShowForm(false);
        setEditingMat(emptyMaterial);
        fetchMaterials();
      }
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدوسية؟')) return;
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      toast.success('تم الحذف');
      fetchMaterials();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const openEdit = (mat: Material) => {
    setEditingMat(mat);
    setIsEditing(true);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingMat(emptyMaterial);
    setIsEditing(false);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الدوسيات (Google Drive)</h1>
          <p className="text-gray-500 text-sm mt-1">{materials.length} ملف مرفوع</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>إضافة دوسية جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      ) : materials.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">لا يوجد ملفات حتى الآن</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div key={mat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full relative">
              {!mat.isActive && (
                <div className="absolute top-2 left-2 z-10 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-lg">
                  غير نشط
                </div>
              )}
              <div className="relative h-40 bg-gray-100 border-b border-gray-100">
                {mat.coverImage ? (
                  <Image src={mat.coverImage} alt={mat.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50/50">
                    <FileText className="w-12 h-12 text-blue-200" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg">
                  <Download className="w-3 h-3" />
                  {mat.downloads}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{mat.subject}</span>
                  {mat.branch && (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{mat.branch}</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{mat.title}</h3>
                <div className="text-gray-500 text-xs space-y-1 mb-4 flex-grow">
                  <p>الصف: {mat.grade}</p>
                  <p>الأستاذ: {mat.teacherName}</p>
                </div>
                
                <div className="flex gap-2 mt-auto pt-4 border-t">
                  <button onClick={() => openEdit(mat)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 text-sm font-medium transition-colors">
                    <Edit className="w-4 h-4" /> تعديل
                  </button>
                  <button onClick={() => handleDelete(mat.id!)} className="flex items-center justify-center px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto pt-10">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'تعديل الدوسية' : 'إضافة دوسية جديدة'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              
              {/* Cover Image Upload */}
              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  {editingMat.coverImage ? (
                    <Image src={editingMat.coverImage} alt="Cover" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[10px] text-center px-1">بدون غلاف</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 font-medium transition-colors">
                    <Upload className="w-4 h-4 text-gray-500" />
                    {uploading ? 'جاري الرفع...' : 'رفع صورة للغلاف (اختياري)'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">يفضل أن تكون الصورة بالطول (نسبة 3:4)</p>
                </div>
              </div>

              {/* Google Drive Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط جوجل درايف *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input dir="ltr" type="url" value={editingMat.googleDriveLink ?? ''} onChange={(e) => setEditingMat({ ...editingMat, googleDriveLink: e.target.value })} placeholder="https://drive.google.com/..." className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <p className="text-xs text-gray-500 mt-1">تأكد من أن الرابط (متاح لأي شخص لديه الرابط - Anyone with the link)</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-900">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدوسية *</label>
                  <input value={editingMat.title ?? ''} onChange={(e) => setEditingMat({ ...editingMat, title: e.target.value })} placeholder="مثال: مكثف الفيزياء الشامل" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المادة *</label>
                  <input value={editingMat.subject ?? ''} onChange={(e) => setEditingMat({ ...editingMat, subject: e.target.value })} placeholder="مثال: فيزياء" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الصف المستهدف *</label>
                  <input value={editingMat.grade ?? ''} onChange={(e) => setEditingMat({ ...editingMat, grade: e.target.value })} placeholder="مثال: التوجيهي" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الأستاذ</label>
                  <input value={editingMat.teacherName ?? ''} onChange={(e) => setEditingMat({ ...editingMat, teacherName: e.target.value })} placeholder="مثال: أ. محمد" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الفرع</label>
                  <select value={editingMat.branch ?? 'أكاديمي'} onChange={(e) => setEditingMat({ ...editingMat, branch: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white">
                    <option value="أكاديمي">أكاديمي</option>
                    <option value="مهني / BTEC">مهني / BTEC</option>
                    <option value="مسار مشترك">مسار مشترك</option>
                    <option value="غير محدد">غير محدد</option>
                  </select>
                </div>

                <div className="col-span-2 flex items-center mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingMat.isActive ?? true} onChange={(e) => setEditingMat({ ...editingMat, isActive: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium text-gray-700">نشط (يظهر للطلاب)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={handleSave} disabled={saving || uploading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /><span>{isEditing ? 'تحديث' : 'حفظ'}</span></>}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
