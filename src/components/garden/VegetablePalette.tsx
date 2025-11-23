'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { VEGETABLES } from '@/data/vegetables';
import { useGardenStore } from '@/store/useGardenStore';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { VegetableDetailDialog } from './VegetableDetailDialog';
import { Vegetable } from '@/types/garden';

export function VegetablePalette({ onSelect }: { onSelect?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailVegetable, setDetailVegetable] = useState<Vegetable | null>(null);
  const { selectedVegetableId, selectVegetable, deselectVegetable } = useGardenStore();

  const toggleSelection = (id: string) => {
    if (selectedVegetableId === id) {
      deselectVegetable();
    } else {
      selectVegetable(id);
      onSelect?.(); // Notify parent
    }
  };

  return (
    <div className="p-4 bg-stone-50 rounded-xl shadow-sm border border-stone-200 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-700">野菜パレット</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden p-1 rounded-full hover:bg-stone-200"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      <div className={cn(
        "grid grid-cols-2 gap-3 transition-all duration-300 overflow-hidden",
        !isExpanded && "max-h-[160px] md:max-h-none" // Show roughly 2 rows on mobile when collapsed
      )}>
        {VEGETABLES.map((veg) => (
          <DraggableVegetable 
            key={veg.id} 
            vegetable={veg} 
            isSelected={selectedVegetableId === veg.id}
            onClick={() => {
              if (selectedVegetableId === veg.id) {
                // If already selected, show details
                setDetailVegetable(veg);
              } else {
                toggleSelection(veg.id);
              }
            }}
            onInfoClick={(e) => {
              e.stopPropagation();
              setDetailVegetable(veg);
            }}
          />
        ))}
      </div>
      
      {!isExpanded && (
        <div className="md:hidden text-center mt-2 text-xs text-stone-500">
          タップして展開
        </div>
      )}

      <VegetableDetailDialog 
        isOpen={!!detailVegetable} 
        onClose={() => setDetailVegetable(null)} 
        vegetable={detailVegetable} 
      />
    </div>
  );
}

function DraggableVegetable({ 
  vegetable, 
  isSelected, 
  onClick,
  onInfoClick
}: { 
  vegetable: typeof VEGETABLES[0], 
  isSelected: boolean,
  onClick: () => void,
  onInfoClick: (e: React.MouseEvent) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${vegetable.id}`,
    data: {
      type: 'vegetable',
      vegetableId: vegetable.id,
      from: 'palette',
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      suppressHydrationWarning
      className={cn(
        "relative flex flex-col items-center justify-center p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all border-2 group",
        vegetable.color,
        isSelected ? "border-blue-500 ring-2 ring-blue-200 scale-105" : "border-transparent hover:border-stone-300",
        isDragging ? "opacity-50 z-50 shadow-xl scale-105" : "shadow-sm"
      )}
    >
      <button 
        onClick={onInfoClick}
        className="absolute top-1 right-1 p-1 text-stone-400 hover:text-stone-600 hover:bg-black/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0"
        // Note: On mobile, hover doesn't exist, so we might want to always show it or handle it differently.
        // Let's make it always visible on mobile or just visible.
        // For simplicity, let's make it always visible but subtle.
        style={{ opacity: 1 }} 
      >
        <Info size={16} />
      </button>

      <span className="text-3xl mb-1">{vegetable.icon}</span>
      <span className="text-xs font-medium text-stone-700">{vegetable.name}</span>
    </div>
  );
}
