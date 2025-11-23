'use client';

import React from 'react';
import { useGardenStore } from '@/store/useGardenStore';
import { Settings2, Grid, Shovel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GardenPlan } from '@/types/garden';

export function LayoutSettings() {
  const { plans, currentPlanId, updatePlan, isLayoutMode, toggleLayoutMode, resizeGrid } = useGardenStore();
  const currentPlan = plans.find(p => p.id === currentPlanId);

  if (!currentPlan) return null;

  const handleUpdate = (key: keyof GardenPlan, value: number) => {
    updatePlan(currentPlan.id, { [key]: value });
  };

  // Also support resizing via resizeGrid for width/height to ensure cells are updated
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    if (!isNaN(newWidth) && newWidth > 0 && newWidth <= 20) {
      resizeGrid(newWidth, currentPlan.height);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    if (!isNaN(newHeight) && newHeight > 0 && newHeight <= 20) {
      resizeGrid(currentPlan.width, newHeight);
    }
  };

  const areaWidthM = (currentPlan.width * (currentPlan.gridCellSizeCm || 20)) / 100;
  const areaHeightM = (currentPlan.height * (currentPlan.gridCellSizeCm || 20)) / 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 mb-4 space-y-4">
      <div>
        <h3 className="font-bold text-stone-700 mb-2 flex items-center gap-2">
          <Settings2 size={18} />
          レイアウト設定
        </h3>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-xs text-stone-500 mb-1">幅 (マス)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={currentPlan.width}
              onChange={handleWidthChange}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">高さ (マス)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={currentPlan.height}
              onChange={handleHeightChange}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">1マス (cm)</label>
            <input
              type="number"
              min="10"
              max="100"
              step="5"
              value={currentPlan.gridCellSizeCm || 20}
              onChange={(e) => handleUpdate('gridCellSizeCm', parseInt(e.target.value) || 20)}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
        </div>
        <div className="text-xs text-stone-500 text-right">
          総面積: {areaWidthM.toFixed(1)}m x {areaHeightM.toFixed(1)}m
        </div>
      </div>

      <div className="border-t pt-3 flex items-center justify-between">
        <button
          onClick={toggleLayoutMode}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm",
            isLayoutMode
              ? "bg-amber-500 text-white shadow-md"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          )}
        >
          <Shovel size={18} />
          {isLayoutMode ? '地形編集モード中' : '地形を編集する'}
        </button>
        
        {isLayoutMode && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-50 border border-amber-200 rounded"></div>
              <span className="text-stone-600">畝</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-stone-200 border border-stone-300 rounded"></div>
              <span className="text-stone-600">通路</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
