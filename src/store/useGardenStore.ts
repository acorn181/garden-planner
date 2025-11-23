import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { GardenState, GardenCell, GardenPlan, VegetableId } from '@/types/garden';

const DEFAULT_WIDTH = 6;
const DEFAULT_HEIGHT = 6;

const createInitialCells = (width: number, height: number): GardenCell[] => {
  const cells: GardenCell[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cells.push({
        id: `${x}-${y}`,
        x,
        y,
        content: null,
        type: 'bed',
      });
    }
  }
  return cells;
};

// Helper to get current plan
const getCurrentPlan = (state: GardenState) => {
  return state.plans.find((p) => p.id === state.currentPlanId);
};

// Helper to update current plan
const updateCurrentPlan = (state: GardenState, updater: (plan: GardenPlan) => GardenPlan): Partial<GardenState> => {
  const currentPlan = getCurrentPlan(state);
  if (!currentPlan) return {};
  
  const updatedPlan = updater({ ...currentPlan, updatedAt: Date.now() });
  
  return {
    plans: state.plans.map((p) => (p.id === state.currentPlanId ? updatedPlan : p)),
  };
};

export const useGardenStore = create<GardenState>()(
  persist(
    (set, get) => ({
      plans: [],
      currentPlanId: null,
      selectedVegetableId: null,
      isLayoutMode: false,

      // Plan Actions
      addPlan: (title, width, height, gridCellSizeCm = 20) => {
        const newPlan: GardenPlan = {
          id: uuidv4(),
          title,
          width,
          height,
          gridCellSizeCm,
          cells: createInitialCells(width, height),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          plans: [...state.plans, newPlan],
          currentPlanId: newPlan.id,
        }));
      },

      updatePlan: (id, data) =>
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p
          ),
        })),

      deletePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
          currentPlanId: state.currentPlanId === id ? null : state.currentPlanId,
        })),

      duplicatePlan: (id) =>
        set((state) => {
          const sourcePlan = state.plans.find((p) => p.id === id);
          if (!sourcePlan) return {};
          
          const newPlan: GardenPlan = {
            ...sourcePlan,
            id: uuidv4(),
            title: `${sourcePlan.title} (コピー)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            // Deep copy cells to avoid reference issues
            cells: JSON.parse(JSON.stringify(sourcePlan.cells)),
          };
          
          return {
            plans: [...state.plans, newPlan],
          };
        }),

      setCurrentPlan: (id) => set({ currentPlanId: id }),

      updateCurrentPlanTitle: (title) =>
        set((state) => updateCurrentPlan(state, (plan) => ({ ...plan, title }))),

      // Editor Actions
      placeVegetable: (cellId, vegetableId) =>
        set((state) => updateCurrentPlan(state, (plan) => ({
          ...plan,
          cells: plan.cells.map((cell) =>
            cell.id === cellId ? { ...cell, content: vegetableId } : cell
          ),
        }))),

      removeVegetable: (cellId) =>
        set((state) => updateCurrentPlan(state, (plan) => ({
          ...plan,
          cells: plan.cells.map((cell) =>
            cell.id === cellId ? { ...cell, content: null } : cell
          ),
        }))),

      moveVegetable: (fromCellId, toCellId) =>
        set((state) => updateCurrentPlan(state, (plan) => {
          const movingVeg = plan.cells.find((c) => c.id === fromCellId)?.content || null;
          const targetVeg = plan.cells.find((c) => c.id === toCellId)?.content || null;

          if (!movingVeg) return plan;

          return {
            ...plan,
            cells: plan.cells.map((cell) => {
              if (cell.id === fromCellId) return { ...cell, content: targetVeg };
              if (cell.id === toCellId) return { ...cell, content: movingVeg };
              return cell;
            }),
          };
        })),

      selectVegetable: (id) => set({ selectedVegetableId: id }),
      deselectVegetable: () => set({ selectedVegetableId: null }),

      toggleLayoutMode: () => set((state) => ({ isLayoutMode: !state.isLayoutMode })),

      toggleCellType: (cellId) =>
        set((state) => updateCurrentPlan(state, (plan) => ({
          ...plan,
          cells: plan.cells.map((cell) => {
            if (cell.id === cellId) {
              const newType = cell.type === 'bed' ? 'pathway' : 'bed';
              return { 
                ...cell, 
                type: newType,
                content: newType === 'pathway' ? null : cell.content 
              };
            }
            return cell;
          }),
        }))),

      resizeGrid: (width, height) =>
        set((state) => updateCurrentPlan(state, (plan) => {
          const newCells: GardenCell[] = [];
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const existing = plan.cells.find((c) => c.x === x && c.y === y);
              if (existing) {
                newCells.push(existing);
              } else {
                newCells.push({
                  id: `${x}-${y}`,
                  x,
                  y,
                  content: null,
                  type: 'bed',
                });
              }
            }
          }
          return { ...plan, width, height, cells: newCells };
        })),
    }),
    {
      name: 'garden-storage',
      // Migration logic to handle old state structure
      /*
      onRehydrateStorage: () => (state) => {
        if (state && (!state.plans || state.plans.length === 0)) {
          // Check if there's old data (width, height, cells directly on state)
          const oldState = state as any;
          if (oldState.cells && Array.isArray(oldState.cells)) {
            const defaultPlan: GardenPlan = {
              id: uuidv4(),
              title: 'マイガーデン',
              width: oldState.width || DEFAULT_WIDTH,
              height: oldState.height || DEFAULT_HEIGHT,
              gridCellSizeCm: 20,
              cells: oldState.cells,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            state.plans = [defaultPlan];
            state.currentPlanId = defaultPlan.id;
          }
        }
      },
      */
    }
  )
);
