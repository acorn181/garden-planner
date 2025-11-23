'use client';

import React from 'react';
import { useGardenStore } from '@/store/useGardenStore';
import { GardenCell } from './GardenCell';
import { ExportButton } from './ExportButton';

export function GardenGrid({ 
  selectedCellId, 
  onSelectCell 
}: { 
  selectedCellId?: string | null, 
  onSelectCell?: (id: string | null) => void 
}) {
  const { plans, currentPlanId } = useGardenStore();
  const currentPlan = plans.find(p => p.id === currentPlanId);

  if (!currentPlan) return <div className="p-8 text-center text-stone-500">プランが見つかりません</div>;

  const { width, height, cells } = currentPlan;

  return (
    <div className="relative p-6 bg-stone-100 rounded-2xl shadow-inner border border-stone-200 overflow-auto">
      <div className="absolute top-2 right-2 z-10">
        <ExportButton targetId="garden-grid-content" />
      </div>
      
      <div 
        id="garden-grid-content"
        className="grid gap-2 mx-auto p-4 bg-stone-100 min-h-[200px]" // Added min-h to ensure clickable area
        onClick={(e) => {
          // Only deselect if clicking the grid background itself, not the cells
          if (e.target === e.currentTarget) {
            onSelectCell?.(null);
          }
        }}
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(80px, 1fr))`,
          maxWidth: 'fit-content'
        }}
      >
        {cells.map((cell) => (
          <GardenCell 
            key={cell.id} 
            cell={cell} 
            isSelected={selectedCellId === cell.id}
            onSelect={() => onSelectCell?.(cell.id)}
          />
        ))}
      </div>
    </div>
  );
}
