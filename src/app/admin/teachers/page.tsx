'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, X, Save, Upload, Users, Crop as CropIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

interface Teacher {
  id?: number;
  name: string;
  subject: string;
  grades: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  bio: string;
  image: string;
  order: number;
  isActive: boolean;
}

const emptyTeacher: Teacher = {
  name: '', subject: '', grades: '', phone: '', whatsapp: '',
  facebook: '', instagram: '', bio: '', image: '', order: 0, isActive: true,
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher>(emptyTeacher);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cropper states
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/teachers');
      const data = await res.json();
      setTeachers(data);
    } finally {
      setLoading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setCropImage(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
    // reset input
    e.target.value = '';
  };

  const handleCropComplete = async () => {
    if (!cropImage || !croppedAreaPixels) return;
    setIsCropping(true);
    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Crop failed');

      const formData = new FormData();
      formData.append('file', croppedBlob, 'cropped.jpg');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setEditingTeacher({ ...editingTeacher, image: data.url });
      toast.success('تم رفع الصورة بنجاح');
      
      setCropImage(null);
      setZoom(1);
    } catch (e) {
      toast.error('حدث خطأ أثناء تعديل الصورة');
    } finally {
      setIsCropping(false);
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingTeacher.name || !editingTeacher.subject) {
      toast.error('الاسم والمادة مطلوبان');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/teachers/${editingTeacher.id}` : '/api/teachers';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTeacher),
      });

      if (res.ok) {
        toast.success(isEditing ? 'تم تحديث الأستاذ' : 'تم إضافة الأستاذ');
        setShowForm(false);
        setEditingTeacher(emptyTeacher);
        fetchTeachers();
      }
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) return;
    try {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      toast.success('تم الحذف');
      fetchTeachers();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const openEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsEditing(true);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingTeacher(emptyTeacher);
    setIsEditing(false);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأساتذة</h1>
          <p className="text-gray-500 text-sm mt-1">{teachers.length} أستاذ مسجل</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>إضافة أستاذ</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {teacher.image ? (
                  <Image src={teacher.image} alt={teacher.name} fill className="object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">أ. {teacher.name}</h3>
                <p className="text-primary-600 text-sm">{teacher.subject}</p>
                <p className="text-gray-500 text-xs mt-1">{teacher.grades}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(teacher)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 text-sm font-medium transition-colors">
                    <Edit className="w-4 h-4" /> تعديل
                  </button>
                  <button onClick={() => handleDelete(teacher.id!)} className="flex items-center justify-center px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'تعديل الأستاذ' : 'إضافة أستاذ جديد'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Image Upload Trigger */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  {editingTeacher.image ? (
                    <Image src={editingTeacher.image} alt="صورة الأستاذ" fill className="object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium">
                  <CropIcon className="w-4 h-4" />
                  {uploading ? 'جاري الرفع...' : 'تغيير الصورة (مع قص ووزن)'}
                  <input type="file" accept="image/*" onChange={onFileSelect} className="hidden" disabled={uploading || isCropping} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم *</label>
                  <input value={editingTeacher.name ?? ''} onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })} placeholder="اسم الأستاذ" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المادة *</label>
                  <input value={editingTeacher.subject ?? ''} onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })} placeholder="مثال: اللغة العربية" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الصفوف (مفصولة بفاصلة)</label>
                <input value={editingTeacher.grades ?? ''} onChange={(e) => setEditingTeacher({ ...editingTeacher, grades: e.target.value })} placeholder="مثال: عاشر,أول ثانوي,ثاني ثانوي" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input value={editingTeacher.phone ?? ''} onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })} placeholder="07xxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white ltr text-right" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">واتساب</label>
                  <input value={editingTeacher.whatsapp ?? ''} onChange={(e) => setEditingTeacher({ ...editingTeacher, whatsapp: e.target.value })} placeholder="07xxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white ltr text-right" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النبذة التعريفية</label>
                <textarea value={editingTeacher.bio ?? ''} onChange={(e) => setEditingTeacher({ ...editingTeacher, bio: e.target.value })} placeholder="اكتب نبذة عن الأستاذ وخبراته..." rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الترتيب</label>
                  <input type="number" value={editingTeacher.order ?? 0} onChange={(e) => setEditingTeacher({ ...editingTeacher, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm text-gray-900 bg-white" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingTeacher.isActive ?? true} onChange={(e) => setEditingTeacher({ ...editingTeacher, isActive: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium text-gray-700">نشط (يظهر في الموقع)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /><span>{isEditing ? 'تحديث' : 'إضافة'}</span></>}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Cropper Modal */}
      {cropImage && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-2xl h-[60vh] bg-black rounded-2xl overflow-hidden">
            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCrop}
              onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels as any)}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="mt-4 w-full max-w-2xl bg-white rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">التقريب (Zoom)</label>
              <input 
                type="range" value={zoom} min={1} max={3} step={0.05}
                onChange={(e) => setZoom(Number(e.target.value))} 
                className="w-full accent-primary-600"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">قم بتحريك الصورة وسحبها لضبطها داخل الإطار لتظهر بشكل ممتاز في الموقع</p>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button onClick={() => setCropImage(null)} className="px-6 py-2.5 border rounded-xl hover:bg-gray-50 font-medium text-gray-700">إلغاء</button>
              <button onClick={handleCropComplete} disabled={isCropping} className="btn-primary px-8 py-2.5 rounded-xl font-medium flex items-center gap-2">
                {isCropping ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> جاري المعالجة...</>
                ) : 'قص وحفظ الصورة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
