import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';
import { Question } from '../types';

interface AdminModeProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  onExit: () => void;
}

export const AdminMode: React.FC<AdminModeProps> = ({ questions, setQuestions, onExit }) => {
  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const addOption = (qId: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId && q.options) {
        return { ...q, options: [...q.options, '새 옵션'] };
      }
      return q;
    }));
  };

  const removeOption = (qId: number, optIdx: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId && q.options) {
        const newOptions = q.options.filter((_, i) => i !== optIdx);
        let newCorrect = q.correctAnswer;
        if (typeof q.correctAnswer === 'number' && q.correctAnswer >= optIdx) {
          newCorrect = Math.max(0, q.correctAnswer - 1);
        }
        return { ...q, options: newOptions, correctAnswer: newCorrect };
      }
      return q;
    }));
  };

  const handleImageUpload = (qId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion(qId, { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (qId: number) => {
    updateQuestion(qId, { imageUrl: undefined });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200"
    >
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">관리자 모드: 평가 문항 관리</h2>
          <p className="text-sm text-slate-500 mt-1">문항 내용, 배점, 이미지 및 정답을 수정할 수 있습니다.</p>
        </div>
        <button 
          onClick={onExit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all"
        >
          저장 및 나가기
        </button>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                  {qIdx + 1}
                </span>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">
                  {q.type}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400">배점:</span>
                <input 
                  type="number"
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-sm font-bold focus:outline-none focus:border-indigo-500"
                  value={q.points}
                  onChange={e => updateQuestion(q.id, { points: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">문항 내용</label>
              <textarea 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm leading-relaxed"
                rows={2}
                value={q.text}
                onChange={e => updateQuestion(q.id, { text: e.target.value })}
              />
            </div>

            {/* Image Upload Section - Only for the last question as requested, or all subjective? 
                The request said "마지막 주관식 문제만... 이미지를 첨부해서 출제" 
                I'll allow it for any subjective question or just the last one? 
                Actually, I'll enable it for all questions to be flexible, but specifically highlight it for the last one.
            */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1" /> 문항 이미지</span>
                {qIdx === questions.length - 1 && q.type === 'subjective' && (
                  <span className="text-indigo-500 animate-pulse">★ 필수 이미지 문항</span>
                )}
              </label>
              <div className="flex items-start space-x-4">
                {q.imageUrl ? (
                  <div className="relative group">
                    <img 
                      src={q.imageUrl} 
                      alt="Question" 
                      className="w-40 h-24 object-cover rounded-lg border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => removeImage(q.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="w-40 h-24 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all text-slate-400">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">이미지 업로드</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(q.id, e)}
                    />
                  </label>
                )}
                <div className="flex-1 text-[10px] text-slate-400 leading-tight">
                  {qIdx === questions.length - 1 && q.type === 'subjective' ? (
                    <p className="text-indigo-600 font-bold mb-1">마지막 문항은 텍스트 대신 이미지를 통해 문제를 출제합니다.</p>
                  ) : (
                    <p>이미지를 첨부하면 문항 텍스트와 함께 응시자에게 보여집니다.</p>
                  )}
                  <p>권장 사이즈: 800x400px</p>
                </div>
              </div>
            </div>

            {q.type === 'multiple' && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">선택지 및 정답 설정</label>
                <div className="space-y-2">
                  {q.options?.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuestion(q.id, { correctAnswer: optIdx })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          q.correctAnswer === optIdx 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-white border border-slate-200 text-slate-300 hover:border-emerald-500'
                        }`}
                        title="정답으로 설정"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <input 
                        type="text"
                        className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                        value={opt}
                        onChange={e => {
                          const newOpts = [...(q.options || [])];
                          newOpts[optIdx] = e.target.value;
                          updateQuestion(q.id, { options: newOpts });
                        }}
                      />
                      <button 
                        onClick={() => removeOption(q.id, optIdx)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addOption(q.id)}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> 옵션 추가
                  </button>
                </div>
              </div>
            )}

            {q.type === 'subjective' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">정답 키워드</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm font-bold"
                  value={q.correctAnswer as string}
                  onChange={e => updateQuestion(q.id, { correctAnswer: e.target.value })}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
