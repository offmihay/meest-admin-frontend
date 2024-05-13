// authProvider.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "./Api";
import AuthContext from "./AuthContext";
import { AuthContextType } from "../types/AuthContextType";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string>(
    localStorage.getItem("userID") || ""
  );
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );
  const navigate = useNavigate();

  const loginAction = async (userData: object) => {
    try {
      const response = await postJson("api/login", userData);
      if (response.userData) {
        setUser(response.userData.userID);
        setToken(response.userData.token);
        localStorage.setItem("userID", response.userData.userID);
        localStorage.setItem("token", response.userData.token);
        navigate("meest-admin/dashboard");
        return;
      }
    } catch (error: any) {
      alert("Username or password is not valid!");
    }
  };

  const logOut = () => {
    setUser("");
    setToken("");
    localStorage.removeItem("userID");
    localStorage.removeItem("token");
    navigate("meest-admin/login");
  };

  const authContextValue: AuthContextType = {
    token,
    user,
    loginAction,
    logOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
