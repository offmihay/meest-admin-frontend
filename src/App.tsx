import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./utils/routes/AppRoutes";
import AuthProvider from "./pages/Login/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
