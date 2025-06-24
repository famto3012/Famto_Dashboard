import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import CustomRouter from "@/routes/CustomRouter.jsx";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { DataProvider } from "@/context/DataContext";
import { SoundProvider } from "@/context/SoundContext";
import { SocketProvider } from "@/context/SocketContext";
import { register } from "@/serviceWorker";
import { OTPProvider } from "@/context/OTPContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider>
    <Toaster />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OTPProvider>
          <DataProvider>
            <SocketProvider>
              <SoundProvider>
                <CustomRouter>
                  <App />
                </CustomRouter>
              </SoundProvider>
            </SocketProvider>
          </DataProvider>
        </OTPProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
  // </StrictMode>
);

register();
