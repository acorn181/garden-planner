'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DragStartEvent,
  useDndContext,
} from '@dnd-kit/core';
import { ArrowLeft, Edit2, ClipboardList } from 'lucide-react';

import { VegetablePalette } from '@/components/garden/VegetablePalette';
import { GardenGrid } from '@/components/garden/GardenGrid';
import { TrashCan } from '@/components/garden/TrashCan';
import { LayoutSettings } from '@/components/garden/LayoutSettings';
import { SummaryDialog } from '@/components/garden/SummaryDialog';
import { useGardenStore } from '@/store/useGardenStore';
import { VEGETABLES } from '@/data/vegetables';
import { cn } from '@/lib/utils';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;
  
  const { 
    plans, 
    setCurrentPlan, 
    updateCurrentPlanTitle,
    placeVegetable, 
    moveVegetable, 
    removeVegetable, 
    deselectVegetable 
  } = useGardenStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeVegId, setActiveVegId] = useState<string | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Load plan on mount
  useEffect(() => {
    if (planId) {
      setCurrentPlan(planId);
    }
  }, [planId, setCurrentPlan]);

  const currentPlan = plans.find(p => p.id === planId);

  // Redirect if plan not found (after hydration)
  useEffect(() => {
    // Small delay to allow hydration
    const timer = setTimeout(() => {
      if (!currentPlan && plans.length > 0) {
        // If plans exist but this one doesn't, go back to dashboard
        // router.push('/'); 
        // Commented out for now to avoid premature redirect during hydration
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPlan, plans, router]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300, // Increased delay to prevent accidental drags
        tolerance: 5, // Allow small movement during delay
      }
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    if (active.data.current) {
      setActiveVegId(active.data.current.vegetableId);
    }
    
    // Prevent scrolling during drag
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveVegId(null);
    
    // Restore scrolling
    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    if (overData.type === 'cell') {
      const cellId = overData.cellId;
      if (activeData.from === 'palette') {
        placeVegetable(cellId, activeData.vegetableId);
      } else if (activeData.from === 'cell') {
        moveVegetable(activeData.cellId, cellId);
      }
    }
    
    if (overData.type === 'trash') {
      if (activeData.from === 'cell') {
        removeVegetable(activeData.cellId);
      }
    }
  };

  const activeVegetable = activeVegId ? VEGETABLES.find(v => v.id === activeVegId) : null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      deselectVegetable();
      setSelectedCellId(null); // Deselect cell on background click
    }
  };

  if (!currentPlan) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50">読み込み中...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main 
        className="min-h-screen bg-slate-50 flex flex-col"
        onClick={handleBackgroundClick}
      >
        <header className="bg-green-700 text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="p-1 hover:bg-green-600 rounded transition-colors"
              title="ダッシュボードに戻る"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="flex-1 flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={currentPlan.title}
                  onChange={(e) => updateCurrentPlanTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="text-xl font-bold bg-green-800 text-white px-2 py-1 rounded outline-none border border-green-500"
                />
              ) : (
                <h1 
                  className="text-xl font-bold flex items-center gap-2 cursor-pointer hover:bg-green-600 px-2 py-1 rounded transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {currentPlan.title}
                  <Edit2 size={16} className="opacity-70" />
                </h1>
              )}
            </div>

            <button
              onClick={() => setIsSummaryOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium text-sm"
            >
              <ClipboardList size={18} />
              <span className="hidden sm:inline">リスト</span>
            </button>
          </div>
        </header>

        <div className="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-6">
          {/* Left Sidebar (Palette) */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-4 order-1 md:order-1">
            <VegetablePalette onSelect={() => setSelectedCellId(null)} />
            <TrashCan />
            <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-200 text-sm text-stone-600">
              <h3 className="font-semibold mb-2">凡例</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-100 border border-green-400 rounded flex items-center justify-center text-[10px]">😊</span>
                  <span>相性が良い (Good)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-100 border border-red-400 rounded flex items-center justify-center text-[10px]">⚠️</span>
                  <span>相性が悪い (Bad)</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content (Grid) */}
          <section className="flex-1 order-2 md:order-2">
            <LayoutSettings />
            <GardenGrid 
              selectedCellId={selectedCellId} 
              onSelectCell={setSelectedCellId}
            />
          </section>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={{
          duration: 250,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeVegetable ? (
            <div className="relative translate-y-[-60px]"> {/* Offset for visibility under finger */}
              {/* Visualization Circle (Background) - Always visible in overlay */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
                style={{
                  width: `${(activeVegetable.sizeCm / (currentPlan?.gridCellSizeCm || 20)) * 104}px`, // 104px = 96px(h-24) + 8px(gap-2)
                  height: `${(activeVegetable.sizeCm / (currentPlan?.gridCellSizeCm || 20)) * 104}px`,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  border: '1px dashed rgba(0,0,0,0.3)',
                }}
              />
              
              {/* Vegetable Card */}
              <div className={cn(
                "relative z-10 flex flex-col items-center justify-center p-3 rounded-lg shadow-2xl scale-110 cursor-grabbing border-2 border-green-500 bg-white", // Added bg-white
                activeVegetable.color
              )}>
                <span className="text-4xl mb-1">{activeVegetable.icon}</span>
                <span className="text-xs font-bold text-stone-800">{activeVegetable.name}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>

        <SummaryDialog 
          isOpen={isSummaryOpen} 
          onClose={() => setIsSummaryOpen(false)} 
          plan={currentPlan} 
        />
      </main>
    </DndContext>
  );
}
