import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Component {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: Component[];
  style?: Record<string, string | number>;
  position?: { x: number; y: number };
}

export interface CanvasState {
  components: Component[];
  selectedComponent: string | null;
  isPreviewMode: boolean;
  canvasScale: number;
}

interface BuilderState {
  canvas: CanvasState;
  draggedComponent: Component | null;
  history: Component[][];
  historyIndex: number;
}

const initialState: BuilderState = {
  canvas: {
    components: [],
    selectedComponent: null,
    isPreviewMode: false,
    canvasScale: 1,
  },
  draggedComponent: null,
  history: [[]],
  historyIndex: 0,
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<Component>) => {
      state.canvas.components.push(action.payload);
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.canvas.components]);
      state.historyIndex += 1;
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      state.canvas.components = state.canvas.components.filter(
        (comp) => comp.id !== action.payload
      );
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.canvas.components]);
      state.historyIndex += 1;
    },
    updateComponent: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Component> }>
    ) => {
      const { id, updates } = action.payload;
      const componentIndex = state.canvas.components.findIndex(
        (comp) => comp.id === id
      );
      if (componentIndex !== -1) {
        state.canvas.components[componentIndex] = {
          ...state.canvas.components[componentIndex],
          ...updates,
        };
      }
    },
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.canvas.selectedComponent = action.payload;
    },
    setDraggedComponent: (state, action: PayloadAction<Component | null>) => {
      state.draggedComponent = action.payload;
    },
    togglePreviewMode: (state) => {
      state.canvas.isPreviewMode = !state.canvas.isPreviewMode;
    },
    setCanvasScale: (state, action: PayloadAction<number>) => {
      state.canvas.canvasScale = action.payload;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.canvas.components = [...state.history[state.historyIndex]];
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.canvas.components = [...state.history[state.historyIndex]];
      }
    },
    clearCanvas: (state) => {
      state.canvas.components = [];
      state.canvas.selectedComponent = null;
      state.history = [[]];
      state.historyIndex = 0;
    },
  },
});

export const {
  addComponent,
  removeComponent,
  updateComponent,
  selectComponent,
  setDraggedComponent,
  togglePreviewMode,
  setCanvasScale,
  undo,
  redo,
  clearCanvas,
} = builderSlice.actions;

export default builderSlice.reducer;
