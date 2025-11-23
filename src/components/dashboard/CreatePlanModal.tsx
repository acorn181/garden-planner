'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useGardenStore } from '@/store/useGardenStore';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlanModal({ isOpen, onClose }: CreatePlanModalProps) {
  const { addPlan } = useGardenStore();
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(6);
  const [gridCellSizeCm, setGridCellSizeCm] = useState(20);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addPlan(title, width, height, gridCellSizeCm);
    setTitle('');
    setWidth(6);
    setHeight(6);
    setGridCellSizeCm(20);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800">新しいプランを作成</h2>
          <button 
            onClick={onClose}
            className="p-1 text-stone-400 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="plan-title" className="block text-sm font-medium text-stone-700 mb-1">
              プラン名
            </label>
            <input
              id="plan-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 2025年 春の家庭菜園"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="plan-width" className="block text-sm font-medium text-stone-700 mb-1">
                幅 (マス)
              </label>
              <input
                id="plan-width"
                type="number"
                min="1"
                max="20"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label htmlFor="plan-height" className="block text-sm font-medium text-stone-700 mb-1">
                高さ (マス)
              </label>
              <input
                id="plan-height"
                type="number"
                min="1"
                max="20"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label htmlFor="plan-cell-size" className="block text-sm font-medium text-stone-700 mb-1">
                1マス (cm)
              </label>
              <input
                id="plan-cell-size"
                type="number"
                min="10"
                max="100"
                step="5"
                value={gridCellSizeCm}
                onChange={(e) => setGridCellSizeCm(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition-colors"
            >
              キャンセル
            </button>
            <button
              id="create-plan-submit"
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              作成する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
