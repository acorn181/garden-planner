export type VegetableId = string;

export interface Vegetable {
  id: VegetableId;
  name: string;
  icon: string; // Emoji or icon name
  color: string; // Tailwind class safe background color
  goodCompanions: VegetableId[];
  badCompanions: VegetableId[];
  description: string;
  plantingPeriod: string;
  harvestPeriod: string;
  tips: string;
  sizeCm: number; // Diameter in cm
}

export type CellType = 'bed' | 'pathway';

export interface GardenCell {
  id: string; // `${x}-${y}`
  x: number;
  y: number;
  content: VegetableId | null;
  type: CellType;
}

export interface GardenPlan {
  id: string;
  title: string;
  width: number;
  height: number;
  gridCellSizeCm: number; // Physical size of one grid cell in cm
  cells: GardenCell[];
  createdAt: number;
  updatedAt: number;
}

export interface GardenState {
  plans: GardenPlan[];
  currentPlanId: string | null;
  selectedVegetableId: VegetableId | null;
  isLayoutMode: boolean;
  moveVegetable: (fromCellId: string, toCellId: string) => void;
  selectVegetable: (id: VegetableId) => void;
  deselectVegetable: () => void;
  toggleLayoutMode: () => void;
  toggleCellType: (cellId: string) => void;
  resizeGrid: (width: number, height: number) => void;
}
