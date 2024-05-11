import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import AuthProvider from "./components/Hooks/AuthProvider";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
