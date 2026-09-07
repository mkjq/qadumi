'use client';

import { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface CenterSettings {
  name: string;
  slogan: string;
  founded: string;
  graduates: string;
  phone_admin: string;
  facebook: string;
  mapsUrl: string;
  workingHours: string;
  grades: string;
  about: string;
  mission: string;
  discounts: string;
  areas: string;
}

const defaultSettings: CenterSettings = {
  name: '',
  slogan: '',
  founded: '',
  graduates: '',
  phone_admin: '',
  facebook: '',
  mapsUrl: '',
  workingHours: '',
  grades: '',
  about: '',
  mission: '',
  discounts: '',
  areas: '',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CenterSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/center')
      .then((r) => r.json())
      .then((data) => {
        setSettings({ ...defaultSettings, ...data });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/center', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success('تم حفظ الإعدادات بنجاح!');
      }
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">جاري التحميل...</div>;

  const fields = [
    { key: 'name' as const, label: 'اسم المركز', type: 'text' },
    { key: 'slogan' as const, label: 'شعار المركز', type: 'text' },
    { key: 'founded' as const, label: 'سنة التأسيس', type: 'text' },
    { key: 'graduates' as const, label: 'عدد الخريجين', type: 'text' },
    { key: 'phone_admin' as const, label: 'رقم الإدارة', type: 'tel' },
    { key: 'workingHours' as const, label: 'ساعات الدوام', type: 'text' },
    { key: 'areas' as const, label: 'مناطق الخدمة', type: 'text' },
    { key: 'facebook' as const, label: 'رابط فيسبوك المركز', type: 'url' },
    { key: 'mapsUrl' as const, label: 'رابط خريطة جوجل', type: 'url' },
    { key: 'grades' as const, label: 'الصفوف المقدمة', type: 'text' },
    { key: 'discounts' as const, label: 'معلومات الخصومات', type: 'text' },
  ];

  const textareas = [
    { key: 'about' as const, label: 'نبذة عن المركز' },
    { key: 'mission' as const, label: 'رسالة المركز' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            إعدادات المركز
          </h1>
          <p className="text-gray-500 text-sm mt-1">تعديل كافة معلومات المركز التي تظهر في الموقع</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>حفظ التغييرات</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={settings[field.key]}
                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
                dir={field.type === 'url' || field.type === 'tel' ? 'ltr' : 'rtl'}
              />
            </div>
          ))}
        </div>

        {textareas.map((field) => (
          <div key={field.key} className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
            <textarea
              value={settings[field.key]}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm resize-none"
            />
          </div>
        ))}

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>حفظ جميع التغييرات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
