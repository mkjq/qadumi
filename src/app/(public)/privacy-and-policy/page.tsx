import React from 'react';

export const metadata = {
  title: 'سياسة الخصوصية | مركز القدومي الثقافي',
  description: 'سياسة الخصوصية الخاصة بتطبيق ومنصة مركز القدومي الثقافي التعليمية',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-sky-600 border-b pb-4 mb-6">
          سياسة الخصوصية - مركز القدومي الثقافي
        </h1>
        <p className="text-sm text-gray-400 mb-8">آخر تحديث: 26 سبتمبر 2026</p>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            نحن في <strong>مركز القدومي الثقافي</strong> نولي خصوصية طلابنا ومستخدمي تطبيقنا وموقعنا أهمية قصوى.
            توضح هذه الوثيقة طبيعة البيانات التي نقوم بجمعها وكيفية معالجتها وحمايتها.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. المعلومات التي يتم جمعها</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>بيانات الحساب:</strong> الاسم، رقم الهاتف، أو البريد الإلكتروني لمتابعة الحصص والدروس.</li>
              <li><strong>البيانات التقنية:</strong> معلومات استخدام عامة لتسريع وتحسين استقرار التطبيق.</li>
              <li><strong>الإشعارات:</strong> نستخدم Firebase لإرسال التنبيهات المدرسية والتحديثات الهامة.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. استخدام المعلومات</h2>
            <p className="text-gray-600">
              تُستخدم البيانات فقط لتقديم الخدمة التعليمية وإدارة الحسابات. لا نقوم إطلاقاً بمشاركة أو بيع أي بيانات لأطراف خارجية.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. أمان البيانات</h2>
            <p className="text-gray-600">
              نطبق أعلى معايير التشفير (HTTPS / SSL) لضمان سرية وأمان كل معاملة وبيانات منقولة عبر التطبيق.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. حذف البيانات وحقوق المستخدم</h2>
            <p className="text-gray-600">
              يمكن لأي مستخدم أو ولي أمر طلب مراجعة بياناته أو حذف حسابه نهائياً في أي وقت عبر التواصل المباشر مع إدارة المركز.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. اتصل بنا</h2>
            <p className="text-gray-600">
              لأي استفسار يخص الخصوصية، يمكنكم التواصل معنا عبر زيارة المركز أو من خلال موقعنا الإلكتروني الرسمي.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
