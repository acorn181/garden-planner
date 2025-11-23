'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGardenStore } from '@/store/useGardenStore';
import { PlanCard } from '@/components/dashboard/PlanCard';
import { CreatePlanModal } from '@/components/dashboard/CreatePlanModal';

export default function Dashboard() {
  const { plans } = useGardenStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🌱 Garden Planner
          </h1>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-stone-800">マイプラン一覧</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            新規作成
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
            <p className="text-stone-500 mb-4">まだプランがありません</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-green-600 font-medium hover:underline"
            >
              最初のプランを作成する
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>

      <CreatePlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
