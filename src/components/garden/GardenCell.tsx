import React, { useState } from 'react';
import { useDroppable, useDraggable, useDndContext } from '@dnd-kit/core';
import { GardenCell as GardenCellType } from '@/types/garden';
import { VEGETABLES } from '@/data/vegetables';
import { useGardenStore } from '@/store/useGardenStore';
import { cn } from '@/lib/utils';
import { VegetableDetailDialog } from './VegetableDetailDialog';

interface GardenCellProps {
  cell: GardenCellType;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Separate component for draggable content to keep logic clean
function DraggableCellContent({ vegetable, cellId, onClick }: { vegetable: any, cellId: string, onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `veg-${cellId}`,
    data: {
      type: 'vegetable',
      vegetableId: vegetable.id,
      from: 'cell',
      cellId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        onClick?.();
        // e.stopPropagation(); // Allow click to propagate to cell if needed, but usually we handle it here
      }}
      className={cn(
        "relative z-10 flex flex-col items-center justify-center p-1 rounded-full shadow-sm transition-transform hover:scale-105 cursor-grab active:cursor-grabbing",
        vegetable.color,
        isDragging && "opacity-50"
      )}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        width: '60px',
        height: '60px',
      }}
    >
      <span className="text-3xl mb-1">{vegetable.icon}</span>
      <span className="text-[10px] font-bold text-stone-700 text-center leading-tight truncate w-full px-1">
        {vegetable.name}
      </span>
    </div>
  );
}

export function GardenCell({ cell, isSelected, onSelect }: GardenCellProps) {
  const { active } = useDndContext(); // Get drag state
  const { 
    plans,
    currentPlanId,
    selectedVegetableId, 
    placeVegetable, 
    deselectVegetable,
    isLayoutMode,
    toggleCellType
  } = useGardenStore();

  const currentPlan = plans.find(p => p.id === currentPlanId);
  const cells = currentPlan?.cells || [];
  const gridCellSizeCm = currentPlan?.gridCellSizeCm || 20;
  
  const contentVeg = cell.content ? VEGETABLES.find(v => v.id === cell.content) : null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${cell.id}`,
    data: {
      type: 'cell',
      cellId: cell.id,
    },
    disabled: isLayoutMode || cell.type === 'pathway',
  });

  const handleClick = (e: React.MouseEvent) => {
    if (isLayoutMode) {
      toggleCellType(cell.id);
      e.stopPropagation();
      return;
    }

    if (cell.type === 'pathway') {
      // Allow bubbling to deselect
      return;
    }

    if (selectedVegetableId) {
      placeVegetable(cell.id, selectedVegetableId);
      deselectVegetable();
      e.stopPropagation();
    } else if (contentVeg) {
      // 2-step interaction:
      // 1. If NOT selected: Select it (show circle)
      // 2. If ALREADY selected: Show details dialog
      
      if (isSelected) {
        setIsDialogOpen(true);
      } else {
        onSelect?.();
        deselectVegetable(); // Ensure palette selection is cleared
      }
      e.stopPropagation();
    } else {
      // Empty cell: Allow bubbling to deselect
    }
  };

  // Distance-based companion logic
  const getCompanions = () => {
    if (!contentVeg) return { good: false, bad: false };

    let hasGood = false;
    let hasBad = false;

    cells.forEach((otherCell) => {
      if (otherCell.id === cell.id) return; // Skip self
      if (!otherCell.content) return;

      const otherVeg = VEGETABLES.find(v => v.id === otherCell.content);
      if (!otherVeg) return;

      // Calculate distance in CM using dynamic gridCellSizeCm
      const dx = (otherCell.x - cell.x) * gridCellSizeCm;
      const dy = (otherCell.y - cell.y) * gridCellSizeCm;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Threshold: Sum of radii
      const r1 = (contentVeg.sizeCm || 30) / 2;
      const r2 = (otherVeg.sizeCm || 30) / 2;
      const threshold = r1 + r2;

      if (distance <= threshold) {
        if (contentVeg.goodCompanions.includes(otherVeg.id)) hasGood = true;
        if (contentVeg.badCompanions.includes(otherVeg.id)) hasBad = true;
      }
    });

    return { good: hasGood, bad: hasBad };
  };

  const { good, bad } = getCompanions();

  // Styles based on type and mode
  const isBed = cell.type === 'bed';
  
  return (
    <>
      <div
        ref={setNodeRef}
        onClick={handleClick}
        className={cn(
          "relative w-full h-24 rounded-md flex items-center justify-center transition-all duration-200 group", // rounded-lg -> rounded-md
          // Lift occupied cells above empty ones so the size circle doesn't get clipped
          contentVeg ? "z-10" : "z-0",
          
          // Base styles for Bed vs Pathway
          isBed 
            ? "bg-amber-100 border-2 border-amber-300 shadow-md" 
            : "bg-stone-300 border-2 border-stone-400 shadow-inner",
          
          // Selection Style
          isSelected && "ring-2 ring-green-500 z-20",

          // Layout Mode Styles
          isLayoutMode && "cursor-pointer hover:opacity-80",
          isLayoutMode && isBed && "hover:bg-amber-200",
          isLayoutMode && !isBed && "hover:bg-stone-300",

          // Planting Mode Styles (Bed)
          !isLayoutMode && isBed && isOver && "border-amber-400 bg-amber-200",
          !isLayoutMode && isBed && good && "border-green-500 bg-green-50 ring-2 ring-green-200",
          !isLayoutMode && isBed && bad && "border-red-500 bg-red-50 ring-2 ring-red-200",
          
          // Planting Mode Styles (Pathway)
          !isLayoutMode && !isBed && "cursor-not-allowed opacity-60"
        )}
      >
        {/* Size Visualization Circle */}
        {contentVeg && isBed && (
          <div 
            className={cn(
              "absolute rounded-full pointer-events-none z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200",
              // Show on hover OR when dragging (any drag operation) OR when selected
              active || isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            style={{
              width: `calc(${(contentVeg.sizeCm / gridCellSizeCm)} * (100% + 0.5rem))`,
              height: `calc(${(contentVeg.sizeCm / gridCellSizeCm)} * (100% + 0.5rem))`,
              backgroundColor: 'rgba(0,0,0,0.05)', // Subtle shadow
              border: '1px dashed rgba(0,0,0,0.2)',
            }}
          />
        )}

        {/* Content */}
        {contentVeg && isBed && (
          <DraggableCellContent vegetable={contentVeg} cellId={cell.id} />
        )}
      </div>
      
      {contentVeg && (
        <VegetableDetailDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          vegetable={contentVeg}
        />
      )}
    </>
  );
}
