'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Copy, Calendar } from 'lucide-react';
import { GardenPlan } from '@/types/garden';
import { useGardenStore } from '@/store/useGardenStore';

interface PlanCardProps {
  plan: GardenPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const router = useRouter();
  const { deletePlan, duplicatePlan } = useGardenStore();

  const handleEdit = () => {
    router.push(`/editor/${plan.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`「${plan.title}」を削除してもよろしいですか？`)) {
      deletePlan(plan.id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicatePlan(plan.id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      onClick={handleEdit}
      className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-stone-800 group-hover:text-green-700 transition-colors line-clamp-1">
          {plan.title}
        </h3>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>更新: {formatDate(plan.updatedAt)}</span>
        </div>
        <div>
          サイズ: {plan.width} x {plan.height}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
        <button
          onClick={handleDuplicate}
          className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors"
          title="複製"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
          title="削除"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors ml-2"
        >
          <Edit size={14} />
          編集
        </button>
      </div>
    </div>
  );
}
