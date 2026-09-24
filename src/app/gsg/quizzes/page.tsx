'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Plus, Edit, Trash2, X, Save, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getQuizzes, saveQuiz, deleteQuiz } from './actions';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    startTransition(async () => {
      try {
        const data = await getQuizzes();
        if (Array.isArray(data)) {
          setQuizzes(data);
        } else {
          setQuizzes([]);
        }
      } catch (err) {
        console.error('Error loading quizzes:', err);
        setQuizzes([]);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;
    try {
      await deleteQuiz(id);
      toast.success('تم الحذف بنجاح');
      loadQuizzes();
    } catch (e) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const handleEdit = (quiz: any) => {
    setEditingQuiz({ ...quiz });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingQuiz({
      title: '',
      description: '',
      subject: '',
      grade: '',
      durationMinutes: 10,
      pointsPerCorrect: 10,
      bonusPoints: 20,
      passingScore: 50,
      isActive: true,
      questions: []
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuiz.questions.length === 0) {
      toast.error('يجب إضافة سؤال واحد على الأقل');
      return;
    }
    
    setSaving(true);
    try {
      await saveQuiz(editingQuiz);
      toast.success('تم الحفظ بنجاح');
      setShowForm(false);
      loadQuizzes();
    } catch (e) {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    };
    setEditingQuiz({ ...editingQuiz, questions: [...editingQuiz.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const updated = [...editingQuiz.questions];
    updated.splice(index, 1);
    setEditingQuiz({ ...editingQuiz, questions: updated });
  };

  const updateQuestion = (index: number, text: string) => {
    const updated = [...editingQuiz.questions];
    updated[index].question = text;
    setEditingQuiz({ ...editingQuiz, questions: updated });
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...editingQuiz.questions];
    updated[qIndex].options[oIndex].text = text;
    setEditingQuiz({ ...editingQuiz, questions: updated });
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...editingQuiz.questions];
    updated[qIndex].options.forEach((o: any, i: number) => {
      o.isCorrect = (i === oIndex);
    });
    setEditingQuiz({ ...editingQuiz, questions: updated });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الاختبارات</h1>
          <p className="text-gray-500 text-sm mt-1">يمكنك إضافة، تعديل وحذف الاختبارات التفاعلية</p>
        </div>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition"
          >
            <Plus size={18} />
            <span>إضافة اختبار</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">{editingQuiz?.id ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-rose-500">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الاختبار</label>
                <input required type="text" value={editingQuiz?.title} onChange={(e) => setEditingQuiz({...editingQuiz, title: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                <input type="text" value={editingQuiz?.description || ''} onChange={(e) => setEditingQuiz({...editingQuiz, description: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">المادة (مثال: رياضيات)</label>
                <input required type="text" value={editingQuiz?.subject} onChange={(e) => setEditingQuiz({...editingQuiz, subject: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الصف (مثال: توجيهي علمي)</label>
                <input required type="text" value={editingQuiz?.grade} onChange={(e) => setEditingQuiz({...editingQuiz, grade: e.target.value})} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المدة (دقائق)</label>
                  <input required type="number" min="1" value={editingQuiz?.durationMinutes} onChange={(e) => setEditingQuiz({...editingQuiz, durationMinutes: e.target.value})} className="w-full border rounded-xl p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">درجة النجاح (%)</label>
                  <input required type="number" min="1" max="100" value={editingQuiz?.passingScore} onChange={(e) => setEditingQuiz({...editingQuiz, passingScore: e.target.value})} className="w-full border rounded-xl p-3 outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نقاط الإجابة الصحيحة</label>
                  <input required type="number" min="1" value={editingQuiz?.pointsPerCorrect} onChange={(e) => setEditingQuiz({...editingQuiz, pointsPerCorrect: e.target.value})} className="w-full border rounded-xl p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نقاط المكافأة (عند الإكمال)</label>
                  <input required type="number" min="0" value={editingQuiz?.bonusPoints} onChange={(e) => setEditingQuiz({...editingQuiz, bonusPoints: e.target.value})} className="w-full border rounded-xl p-3 outline-none" />
                </div>
              </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">الأسئلة ({editingQuiz?.questions?.length})</h3>
              <button type="button" onClick={addQuestion} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-200">
                + إضافة سؤال
              </button>
            </div>

            <div className="space-y-6 mb-8">
              {editingQuiz?.questions?.map((q: any, qIndex: number) => (
                <div key={qIndex} className="p-5 border border-gray-200 rounded-xl bg-gray-50 relative">
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 left-4 text-rose-500 hover:text-rose-700 p-2 bg-rose-100 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                  <div className="mb-4 pr-10">
                    <label className="block text-sm font-bold text-gray-700 mb-2">نص السؤال {qIndex + 1}</label>
                    <input required type="text" value={q.question} onChange={(e) => updateQuestion(qIndex, e.target.value)} className="w-full border rounded-lg p-2.5 outline-none text-gray-900 bg-white" placeholder="اكتب السؤال هنا..." />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt: any, oIndex: number) => (
                      <div key={oIndex} className={`flex items-center gap-2 p-2 border rounded-lg ${opt.isCorrect ? 'border-emerald-500 bg-emerald-50' : 'bg-white'}`}>
                        <button type="button" onClick={() => setCorrectOption(qIndex, oIndex)} className={`w-6 h-6 rounded-full flex items-center justify-center border flex-shrink-0 ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>
                          {opt.isCorrect && <CheckCircle size={14} />}
                        </button>
                        <input required type="text" value={opt.text} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} className="w-full bg-transparent outline-none text-sm p-1 text-gray-900" placeholder={`الخيار ${oIndex + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100">
                إلغاء
              </button>
              <button type="submit" disabled={saving} className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2">
                <Save size={18} />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ الاختبار'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isPending ? (
            <p className="text-gray-500 p-8 text-center col-span-3">جاري التحميل...</p>
          ) : quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span className="bg-cyan-50 text-cyan-700 text-xs font-bold px-2 py-1 rounded-md">{quiz.subject}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{quiz.grade}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(quiz)} className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(quiz.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">{quiz.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{quiz.description}</p>
              
              <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-3 rounded-xl">
                <span>⏱ {quiz.durationMinutes} دقائق</span>
                <span>•</span>
                <span>❓ {quiz.questions.length} سؤال</span>
                <span>•</span>
                <span className="text-emerald-600">🏆 {quiz.questions.length * quiz.pointsPerCorrect + quiz.bonusPoints} نقطة كحد أقصى</span>
              </div>
            </div>
          ))}
          {!isPending && quizzes.length === 0 && (
             <div className="col-span-3 text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
               <FileText size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-500 font-bold">لا يوجد اختبارات حالياً. أضف اختباراً جديداً!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
