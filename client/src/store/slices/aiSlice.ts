import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AIPrompt {
  id: string;
  prompt: string;
  response?: string;
  timestamp: number;
  type: "component" | "layout" | "style" | "backend";
}

interface AIState {
  isGenerating: boolean;
  prompts: AIPrompt[];
  currentPrompt: string;
  generatedCode: string;
  error: string | null;
  suggestions: string[];
}

const initialState: AIState = {
  isGenerating: false,
  prompts: [],
  currentPrompt: "",
  generatedCode: "",
  error: null,
  suggestions: [
    "Create a hero section with a call-to-action button",
    "Add a navigation bar with logo and menu items",
    "Generate a contact form with validation",
    "Create a pricing table with three tiers",
    "Add a footer with social media links",
  ],
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setCurrentPrompt: (state, action: PayloadAction<string>) => {
      state.currentPrompt = action.payload;
    },
    startGeneration: (state) => {
      state.isGenerating = true;
      state.error = null;
    },
    generationSuccess: (
      state,
      action: PayloadAction<{ prompt: AIPrompt; code: string }>
    ) => {
      state.isGenerating = false;
      state.prompts.push(action.payload.prompt);
      state.generatedCode = action.payload.code;
      state.currentPrompt = "";
    },
    generationError: (state, action: PayloadAction<string>) => {
      state.isGenerating = false;
      state.error = action.payload;
    },
    clearGeneratedCode: (state) => {
      state.generatedCode = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    addSuggestion: (state, action: PayloadAction<string>) => {
      if (!state.suggestions.includes(action.payload)) {
        state.suggestions.push(action.payload);
      }
    },
  },
});

export const {
  setCurrentPrompt,
  startGeneration,
  generationSuccess,
  generationError,
  clearGeneratedCode,
  clearError,
  addSuggestion,
} = aiSlice.actions;

export default aiSlice.reducer;
