'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TrashCan() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash-can',
    data: {
      type: 'trash',
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-default",
        isOver
          ? "bg-red-100 border-red-400 text-red-600 scale-105"
          : "bg-stone-100 border-stone-200 text-stone-500 hover:border-stone-300"
      )}
    >
      <Trash2 size={24} />
      <span className="font-medium">ここにドロップして削除</span>
    </div>
  );
}
