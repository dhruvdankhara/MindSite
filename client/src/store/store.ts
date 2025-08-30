import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "./slices/builderSlice";
import projectReducer from "./slices/projectSlice";
import aiReducer from "./slices/aiSlice";

export const store = configureStore({
  reducer: {
    builder: builderReducer,
    projects: projectReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
