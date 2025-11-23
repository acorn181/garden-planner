'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Vegetable } from '@/types/garden';
import { VEGETABLES } from '@/data/vegetables';

interface VegetableDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vegetable: Vegetable | null;
}

export function VegetableDetailDialog({ isOpen, onClose, vegetable }: VegetableDetailDialogProps) {
  if (!vegetable) return null;

  const getVegetableName = (id: string) => VEGETABLES.find(v => v.id === id)?.name || id;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl p-2 bg-stone-100 rounded-full">{vegetable.icon}</span>
            <DialogTitle className="text-2xl">{vegetable.name}</DialogTitle>
          </div>
          <DialogDescription className="text-base text-stone-600">
            {vegetable.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-800 text-sm mb-1">植え付け</h4>
              <p className="text-sm text-stone-700">{vegetable.plantingPeriod}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <h4 className="font-semibold text-orange-800 text-sm mb-1">収穫</h4>
              <p className="text-sm text-stone-700">{vegetable.harvestPeriod}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-stone-800 flex items-center gap-2">
              🌱 育て方のポイント
            </h4>
            <p className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
              {vegetable.tips}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-stone-800">コンパニオンプランツ</h4>
            <div className="flex flex-wrap gap-2">
              {vegetable.goodCompanions.length > 0 ? (
                vegetable.goodCompanions.map(id => (
                  <span key={id} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                    😊 {getVegetableName(id)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-500">特になし</span>
              )}
              {vegetable.badCompanions.map(id => (
                <span key={id} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200">
                  ⚠️ {getVegetableName(id)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
