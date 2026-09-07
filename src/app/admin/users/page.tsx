'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Shield, Check, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminUser {
  id?: number;
  name: string;
  username: string;
  password?: string;
  role: string;
  permissions: string;
  isActive: boolean;
}

const emptyUser: AdminUser = {
  name: '', username: '', password: '', role: 'ADMIN', permissions: 'MESSAGES,REVIEWS', isActive: true
};

const availablePermissions = [
  { id: 'TEACHERS', label: 'إدارة الأساتذة' },
  { id: 'MATERIALS', label: 'إدارة الدوسيات' },
  { id: 'MESSAGES', label: 'صندوق الرسائل' },
  { id: 'REVIEWS', label: 'التقييمات' },
  { id: 'CARDS', label: 'إدارة البطاقات' },
  { id: 'ORDERS', label: 'إدارة الطلبات' },
  { id: 'SETTINGS', label: 'إعدادات المركز' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser>(emptyUser);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admins');
      if (!res.ok) {
        toast.error('لا تملك صلاحية للوصول لهذه الصفحة');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permId: string) => {
    if (editingUser.role === 'SUPER_ADMIN') return; // Super admin has all
    let currentPerms = editingUser.permissions.split(',').filter(Boolean);
    if (currentPerms.includes(permId)) {
      currentPerms = currentPerms.filter(p => p !== permId);
    } else {
      currentPerms.push(permId);
    }
    setEditingUser({ ...editingUser, permissions: currentPerms.join(',') });
  };

  const handleSave = async () => {
    if (!editingUser.name || !editingUser.username) {
      toast.error('الاسم واسم المستخدم مطلوبان');
      return;
    }
    if (!isEditing && !editingUser.password) {
      toast.error('كلمة المرور مطلوبة للعضو الجديد');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/admins/${editingUser.id}` : '/api/admins';
      const method = isEditing ? 'PUT' : 'POST';

      // if super admin, set permissions to ALL
      const dataToSave = { ...editingUser };
      if (dataToSave.role === 'SUPER_ADMIN') dataToSave.permissions = 'ALL';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        toast.success(isEditing ? 'تم التحديث' : 'تم إضافة العضو');
        setShowForm(false);
        setEditingUser(emptyUser);
        fetchUsers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'حدث خطأ');
      }
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو نهائياً؟')) return;
    try {
      const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم الحذف');
        fetchUsers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل الحذف');
      }
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const openEdit = (u: AdminUser) => {
    setEditingUser({ ...u, password: '' });
    setIsEditing(true);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingUser(emptyUser);
    setIsEditing(false);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المشرفين والأعضاء</h1>
          <p className="text-gray-500 text-sm mt-1">إضافة أعضاء للوحة التحكم وتحديد صلاحياتهم</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>إضافة عضو</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <Shield className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">لا يوجد أعضاء</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">الاسم</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">اسم المستخدم (للدخول)</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">الرتبة</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">الحالة</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-900">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600 ltr text-right">{u.username}</td>
                    <td className="px-6 py-4">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">مدير عام (كافة الصلاحيات)</span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">مشرف فرعي</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.isActive ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><Check className="w-4 h-4" /> نشط</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm font-medium"><XCircle className="w-4 h-4" /> موقوف</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEdit(u)} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(u.id!)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'تعديل العضو' : 'إضافة مشرف جديد'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                  <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} placeholder="مثال: أحمد القدومي" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم للدخول *</label>
                  <input value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} placeholder="مثال: ahmad_q" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm ltr text-right" dir="ltr" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور {isEditing && <span className="text-gray-400 font-normal">(اتركها فارغة إذا لم ترد تغييرها)</span>}
                  </label>
                  <input type="password" value={editingUser.password} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm ltr text-right" dir="ltr" />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-900 mb-3">الصلاحيات والرتبة</label>
                <select 
                  value={editingUser.role} 
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full mb-4 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
                >
                  <option value="ADMIN">مشرف فرعي (صلاحيات مخصصة)</option>
                  <option value="SUPER_ADMIN">مدير عام (جميع الصلاحيات)</option>
                </select>

                {editingUser.role === 'ADMIN' && (
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <p className="text-xs text-gray-500 mb-3 font-bold">حدد الصفحات المسموح له بإدارتها:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {availablePermissions.map(perm => (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={editingUser.permissions.includes(perm.id)}
                            onChange={() => handlePermissionToggle(perm.id)}
                            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" 
                          />
                          <span className="text-sm font-medium text-gray-700">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" checked={editingUser.isActive} onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })} className="w-4 h-4 rounded text-primary-600" />
                <label htmlFor="isActive" className="text-sm font-bold text-gray-900 cursor-pointer">الحساب نشط (يمكنه تسجيل الدخول)</label>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /><span>{isEditing ? 'حفظ التعديلات' : 'إضافة العضو'}</span></>}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
