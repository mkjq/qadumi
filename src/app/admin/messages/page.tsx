'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Trash2, CheckCircle, Clock, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  name: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: number) => {
    await fetch(`/api/messages/${id}`, { method: 'PATCH' });
    setMessages(messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('هل تريد حذف هذه الرسالة؟')) return;
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    setMessages(messages.filter((m) => m.id !== id));
    toast.success('تم الحذف');
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">الرسائل الواردة</h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages.length} رسالة إجمالي • {unread} غير مقروءة
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">لا توجد رسائل بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border-r-4 ${
                msg.isRead ? 'border-gray-200' : 'border-primary-500'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-900">{msg.name}</span>
                    </div>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-primary-600 hover:text-primary-800 text-sm">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="ltr">{msg.phone}</span>
                      </a>
                    )}
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(msg.createdAt).toLocaleDateString('ar-JO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {!msg.isRead && (
                      <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">جديد</span>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{msg.message}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!msg.isRead && (
                    <button
                      onClick={() => markRead(msg.id)}
                      className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="تحديد كمقروء"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title="حذف"
                  >
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
