'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Eye, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string | null;
  paymentMethod: string;
  receiptUrl: string | null;
  status: string;
  createdAt: string;
  courseCard: {
    title: string;
    teacherName: string;
    price: number;
  };
}

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error('حدث خطأ أثناء جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    if (!confirm(`هل أنت متأكد من تغيير حالة الطلب إلى: ${status}؟`)) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('تم تحديث حالة الطلب');
        fetchOrders();
      }
    } catch {
      toast.error('حدث خطأ');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.includes(search) || o.phone.includes(search) || o.courseCard.title.includes(search)
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5"/> قيد الانتظار</span>;
      case 'APPROVED': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="w-3.5 h-3.5"/> تم التأكيد</span>;
      case 'REJECTED': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="w-3.5 h-3.5"/> مرفوض</span>;
      default: return null;
    }
  };

  const getPaymentMethod = (method: string) => {
    switch(method) {
      case 'CLIQ': return 'كليك (CliQ)';
      case 'ZAIN_CASH': return 'زين كاش';
      case 'DELIVERY': return 'دفع عند التوصيل';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الطلبات والمبيعات</h1>
          <p className="text-gray-500">إدارة طلبات شراء البطاقات والدفع الإلكتروني</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative max-w-md mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث برقم الهاتف، اسم الطالب، أو البطاقة..."
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
                  <th className="pb-3 font-semibold">رقم الطلب</th>
                  <th className="pb-3 font-semibold">الطالب / الهاتف</th>
                  <th className="pb-3 font-semibold">البطاقة</th>
                  <th className="pb-3 font-semibold">طريقة الدفع</th>
                  <th className="pb-3 font-semibold">الوصل</th>
                  <th className="pb-3 font-semibold">الحالة</th>
                  <th className="pb-3 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="py-4 font-bold text-gray-900">#{order.id}</td>
                    <td className="py-4">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500 font-sans">{order.phone}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-gray-900">{order.courseCard.title}</div>
                      <div className="text-xs text-primary-600 font-bold">{order.courseCard.price} د.أ</div>
                    </td>
                    <td className="py-4 text-gray-600">
                      {getPaymentMethod(order.paymentMethod)}
                    </td>
                    <td className="py-4">
                      {order.receiptUrl ? (
                        <a href={order.receiptUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
                          <ExternalLink className="w-4 h-4" /> عرض الوصل
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">لا يوجد</span>
                      )}
                    </td>
                    <td className="py-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4">
                      {order.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateStatus(order.id, 'APPROVED')} className="p-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100" title="تأكيد الطلب">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => updateStatus(order.id, 'REJECTED')} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100" title="رفض الطلب">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
