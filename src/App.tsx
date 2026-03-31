/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ClipboardCheck,
  Settings,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { AdminMode } from './components/AdminMode';
import { UserMode } from './components/UserMode';
import { INITIAL_QUESTIONS } from './constants';
import { Question } from './types';

export default function App() {
  const [mode, setMode] = useState<'selection' | 'user' | 'admin'>('selection');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans selection:bg-[#cbd5e1]">
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-200">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900"> AI.SW 학생 역량 평가 시스템</h1>
          <p className="text-slate-500 mt-2">정확하고 명확한 역량 진단 도구</p>
        </header>

        {mode === 'selection' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <button 
              onClick={() => setMode('user')}
              className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <UserIcon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">사용자 모드</h2>
              <p className="text-sm text-slate-500">역량 평가를 시작하고 결과를 확인합니다.</p>
              <div className="mt-8 px-6 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                응시하기
              </div>
            </button>

            <button 
              onClick={() => setMode('admin')}
              className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <ShieldCheck className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">관리자 모드</h2>
              <p className="text-sm text-slate-500">평가 문항을 관리하고 정답을 수정합니다.</p>
              <div className="mt-8 px-6 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                설정하기
              </div>
            </button>
          </div>
        )}

        {mode === 'user' && (
          <UserMode 
            questions={questions} 
            onFinish={() => {}} 
          />
        )}

        {mode === 'admin' && (
          <AdminMode 
            questions={questions} 
            setQuestions={setQuestions} 
            onExit={() => setMode('selection')} 
          />
        )}

        {/* Back to Selection button when in User mode */}
        {mode === 'user' && (
          <div className="fixed bottom-6 right-6">
            <button 
              onClick={() => setMode('selection')}
              className="p-3 bg-white border border-slate-200 rounded-full shadow-lg hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600"
              title="모드 선택으로 돌아가기"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Footer Info */}
        <footer className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 Assessment System • Professional Edition</p>
        </footer>
      </main>
    </div>
  );
}
