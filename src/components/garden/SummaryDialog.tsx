import React, { useState } from 'react';
import { X, Copy, Check, ShoppingCart, Sprout, Calendar } from 'lucide-react';
import { GardenPlan } from '@/types/garden';
import { useGardenSummary } from '@/hooks/useGardenSummary';
import { cn } from '@/lib/utils';

interface SummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: GardenPlan;
}

type Tab = 'shop' | 'soil' | 'schedule';

export function SummaryDialog({ isOpen, onClose, plan }: SummaryDialogProps) {
  const { bedAreaM2, vegetableCounts, fertilizers, schedule } = useGardenSummary(plan);
  const [activeTab, setActiveTab] = useState<Tab>('shop');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const lines = [
      `🌱 ${plan.title} - 買い物リスト`,
      '',
      '【野菜苗】',
      ...vegetableCounts.map(v => `- ${v.vegetable.name}: ${v.count}株`),
      '',
      '【元肥目安】',
      `- 牛糞堆肥: ${fertilizers.cowManureKg}kg`,
      `- 苦土石灰: ${fertilizers.limeG}g`,
      `- 化成肥料: ${fertilizers.chemicalG}g`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            📊 プランサマリー
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-stone-400 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100">
          <button
            onClick={() => setActiveTab('shop')}
            className={cn(
              "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative",
              activeTab === 'shop' ? "text-green-600" : "text-stone-500 hover:text-stone-700"
            )}
          >
            <ShoppingCart size={16} />
            買い物
            {activeTab === 'shop' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('soil')}
            className={cn(
              "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative",
              activeTab === 'soil' ? "text-amber-600" : "text-stone-500 hover:text-stone-700"
            )}
          >
            <Sprout size={16} />
            土作り
            {activeTab === 'soil' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={cn(
              "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative",
              activeTab === 'schedule' ? "text-blue-600" : "text-stone-500 hover:text-stone-700"
            )}
          >
            <Calendar size={16} />
            日程
            {activeTab === 'schedule' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Shop Tab */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-stone-700">野菜苗</h3>
                  <button
                    onClick={handleCopy}
                    className="text-xs flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'コピー完了' : 'リストをコピー'}
                  </button>
                </div>
                {vegetableCounts.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-4">野菜が配置されていません</p>
                ) : (
                  <ul className="space-y-2">
                    {vegetableCounts.map(({ vegetable, count }) => (
                      <li key={vegetable.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{vegetable.icon}</span>
                          <span className="font-medium text-stone-700">{vegetable.name}</span>
                        </div>
                        <span className="font-bold text-stone-800 bg-white px-3 py-1 rounded border border-stone-200">
                          x {count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="font-bold text-stone-700 mb-3">肥料・資材</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-stone-700">牛糞堆肥</span>
                    <span className="font-bold text-stone-800">{fertilizers.cowManureKg} kg</span>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-stone-700">苦土石灰</span>
                    <span className="font-bold text-stone-800">{fertilizers.limeG} g</span>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-stone-700">化成肥料 (8-8-8)</span>
                    <span className="font-bold text-stone-800">{fertilizers.chemicalG} g</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Soil Tab */}
          {activeTab === 'soil' && (
            <div className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                <p className="text-sm text-amber-800 mb-1">対象面積 (畝のみ)</p>
                <p className="text-3xl font-bold text-amber-900">{bedAreaM2} ㎡</p>
              </div>

              <div>
                <h3 className="font-bold text-stone-700 mb-4 flex items-center gap-2">
                  <Sprout size={20} className="text-amber-600" />
                  元肥（もとごえ）の目安
                </h3>
                
                <div className="grid gap-4">
                  <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-bold text-stone-700">牛糞堆肥</span>
                      <span className="text-2xl font-bold text-amber-600">{fertilizers.cowManureKg} <span className="text-sm text-stone-500">kg</span></span>
                    </div>
                    <p className="text-xs text-stone-400">土壌改良・ベース作り (2kg/㎡)</p>
                  </div>

                  <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-bold text-stone-700">苦土石灰</span>
                      <span className="text-2xl font-bold text-stone-600">{fertilizers.limeG} <span className="text-sm text-stone-500">g</span></span>
                    </div>
                    <p className="text-xs text-stone-400">酸度調整 (100g/㎡)</p>
                  </div>

                  <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-bold text-stone-700">化成肥料</span>
                      <span className="text-2xl font-bold text-stone-600">{fertilizers.chemicalG} <span className="text-sm text-stone-500">g</span></span>
                    </div>
                    <p className="text-xs text-stone-400">初期栄養 (100g/㎡)</p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-100 p-3 rounded-lg text-xs text-stone-500 space-y-1">
                <p>※ 上記は標準的な元肥の量です。追肥（栽培中の肥料）は含まれていません。</p>
                <p>※ 土壌の状態や、育てる野菜に合わせて調整してください。</p>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {schedule.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-4">野菜が配置されていません</p>
              ) : (
                schedule.map((veg) => (
                  <div key={veg.id} className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{veg.icon}</span>
                      <span className="font-bold text-stone-800">{veg.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs text-stone-400 mb-1">植え付け</span>
                        <span className="font-medium text-green-700 bg-green-50 px-2 py-1 rounded block text-center">
                          {veg.plantingPeriod}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-stone-400 mb-1">収穫</span>
                        <span className="font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded block text-center">
                          {veg.harvestPeriod}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
