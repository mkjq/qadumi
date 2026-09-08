'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Upload, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface Material {
  id?: number;
  title: string;
  subject: string;
  grade: string;
  teacherName: string;
  fileUrl: string;
  downloads: number;
  isActive: boolean;
}

const emptyMaterial: Material = {
  title: '', subject: '', grade: '', teacherName: '', fileUrl: '', downloads: 0, isActive: true
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-doc', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setEditingMat({ ...editingMat, fileUrl: data.url });
        toast.success('تم رفع الملف بنجاح');
      } else {
        toast.error('فشل الرفع');
      }
    } catch {
      toast.error('حدث خطأ أثناء الرفع');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!editingMat.title || !editingMat.subject || !editingMat.fileUrl) {
      toast.error('العنوان، المادة، والملف (PDF) مطلوبة');
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
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
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
          <h1 className="text-2xl font-bold text-gray-900">مكتبة الدوسيات والملفات</h1>
          <p className="text-gray-500 text-sm mt-1">{materials.length} ملف مرفوع</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>إضافة ملف جديد</span>
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
            <div key={mat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden p-5 border border-gray-100 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                  <Download className="w-4 h-4" />
                  {mat.downloads} مرة
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{mat.title}</h3>
              <p className="text-primary-600 text-sm font-medium mb-1">{mat.subject}</p>
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
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'تعديل الملف' : 'إضافة ملف جديد (PDF)'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* File Upload Trigger */}
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
                <label className="cursor-pointer inline-flex flex-col items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium w-full">
                  <Upload className="w-6 h-6 mb-1 text-gray-400" />
                  {uploading ? 'جاري رفع الملف...' : editingMat.fileUrl ? 'تم رفع الملف بنجاح! اضغط لتغييره' : 'اضغط لاختيار ملف (PDF, DOCX)'}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>
                {editingMat.fileUrl && !uploading && (
                  <p className="text-xs text-green-600 mt-2 font-bold break-all">{editingMat.fileUrl}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-900">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدوسية / الملف *</label>
                  <input value={editingMat.title ?? ''} onChange={(e) => setEditingMat({ ...editingMat, title: e.target.value })} placeholder="مثال: مكثف الفيزياء الشامل" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المادة *</label>
                  <input value={editingMat.subject ?? ''} onChange={(e) => setEditingMat({ ...editingMat, subject: e.target.value })} placeholder="مثال: فيزياء" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الصف المستهدف *</label>
                  <input value={editingMat.grade ?? ''} onChange={(e) => setEditingMat({ ...editingMat, grade: e.target.value })} placeholder="مثال: توجيهي علمي" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الأستاذ</label>
                  <input value={editingMat.teacherName ?? ''} onChange={(e) => setEditingMat({ ...editingMat, teacherName: e.target.value })} placeholder="مثال: أ. محمد القدومي" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
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
