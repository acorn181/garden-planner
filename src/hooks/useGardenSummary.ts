import { useMemo } from 'react';
import { GardenPlan, Vegetable } from '@/types/garden';
import { VEGETABLES } from '@/data/vegetables';

interface FertilizerAmount {
  cowManureKg: number;
  limeG: number;
  chemicalG: number;
}

interface VegetableSummary {
  vegetable: Vegetable;
  count: number;
}

export function useGardenSummary(plan: GardenPlan | undefined) {
  return useMemo(() => {
    if (!plan) {
      return {
        bedAreaM2: 0,
        vegetableCounts: [] as VegetableSummary[],
        fertilizers: { cowManureKg: 0, limeG: 0, chemicalG: 0 },
        schedule: [] as Vegetable[],
      };
    }

    // 1. Calculate Bed Area
    const bedCells = plan.cells.filter((cell) => cell.type === 'bed');
    const bedCount = bedCells.length;
    const cellSizeM = (plan.gridCellSizeCm || 20) / 100;
    const bedAreaM2 = Number((bedCount * cellSizeM * cellSizeM).toFixed(2));

    // 2. Calculate Fertilizers
    // Cow Manure: 2kg / m2
    // Lime: 100g / m2
    // Chemical: 100g / m2
    const fertilizers: FertilizerAmount = {
      cowManureKg: Math.ceil(bedAreaM2 * 2),
      limeG: Math.ceil(bedAreaM2 * 100),
      chemicalG: Math.ceil(bedAreaM2 * 100),
    };

    // 3. Count Vegetables
    const counts = new Map<string, number>();
    plan.cells.forEach((cell) => {
      if (cell.content) {
        counts.set(cell.content, (counts.get(cell.content) || 0) + 1);
      }
    });

    const vegetableCounts: VegetableSummary[] = Array.from(counts.entries())
      .map(([id, count]) => {
        const vegetable = VEGETABLES.find((v) => v.id === id);
        return vegetable && count > 0 ? { vegetable, count } : null;
      })
      .filter((item): item is VegetableSummary => item !== null)
      .sort((a, b) => a.vegetable.name.localeCompare(b.vegetable.name));

    // 4. Schedule (Unique list of vegetables)
    const schedule = Array.from(new Set(vegetableCounts.map((v) => v.vegetable)));

    return {
      bedAreaM2,
      vegetableCounts,
      fertilizers,
      schedule,
    };
  }, [plan]);
}
