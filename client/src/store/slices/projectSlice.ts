import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
  settings: {
    theme: "light" | "dark";
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: number | null;
}

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  isLoading: false,
  isSaving: false,
  lastSaved: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    createProject: (
      state,
      action: PayloadAction<Omit<Project, "id" | "createdAt" | "updatedAt">>
    ) => {
      const newProject: Project = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.projects.push(newProject);
      state.currentProject = newProject;
    },
    loadProject: (state, action: PayloadAction<string>) => {
      const project = state.projects.find((p) => p.id === action.payload);
      if (project) {
        state.currentProject = project;
      }
    },
    updateProject: (state, action: PayloadAction<Partial<Project>>) => {
      if (state.currentProject) {
        state.currentProject = {
          ...state.currentProject,
          ...action.payload,
          updatedAt: Date.now(),
        };
        const index = state.projects.findIndex(
          (p) => p.id === state.currentProject?.id
        );
        if (index !== -1) {
          state.projects[index] = state.currentProject;
        }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setLastSaved: (state) => {
      state.lastSaved = Date.now();
    },
    updateProjectSettings: (
      state,
      action: PayloadAction<Partial<Project["settings"]>>
    ) => {
      if (state.currentProject) {
        state.currentProject.settings = {
          ...state.currentProject.settings,
          ...action.payload,
        };
        state.currentProject.updatedAt = Date.now();
      }
    },
  },
});

export const {
  setCurrentProject,
  createProject,
  loadProject,
  updateProject,
  deleteProject,
  setLoading,
  setSaving,
  setLastSaved,
  updateProjectSettings,
} = projectSlice.actions;

export default projectSlice.reducer;
