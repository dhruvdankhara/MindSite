import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store";
import { AppRoutes } from "./components/routing/AppRoutes";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { Navigation } from "./components/layout/Navigation";
import { StatusBar } from "./components/layout/StatusBar";
import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="App min-h-screen bg-background text-foreground">
          <Navigation />
          <AppRoutes />
          <StatusBar />

          {/* Global Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "bg-background text-foreground border border-border",
            }}
          />
        </div>
      </ThemeProvider>
    </Provider>
  );
}
