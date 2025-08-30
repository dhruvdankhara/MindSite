import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "./slices/builderSlice";
import projectsReducer from "./slices/projectSlice";
import aiReducer from "./slices/aiSlice";

export const store = configureStore({
  reducer: {
    builder: builderReducer,
    projects: projectsReducer,
    ai: aiReducer,
  },
});

export * from "./store";
export * from "./hooks";
export type { RootState, AppDispatch } from "./store";
