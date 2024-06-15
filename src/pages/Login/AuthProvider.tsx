// authProvider.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postJson } from "../../api/Api";
import AuthContext from "../../context/AuthContext";
import { AuthContextType } from "../../utils/types/AuthContextType";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string>(localStorage.getItem("userId") || "");

  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token") || "";
    const localStorageUserId = localStorage.getItem("userId") || "";
    if (localStorageToken !== token || localStorageUserId !== userId) {
      setToken(localStorageToken);
      setUserId(localStorageUserId);
    }
  }, [token, userId, location.pathname]);

  const login = async (userData: object) => {
    try {
      const response = await postJson("api/login", userData);
      if (response.userData) {
        localStorage.setItem("userId", response.userData.userId);
        localStorage.setItem("token", response.userData.token);
        setUserId(response.userData.userId);
        setToken(response.userData.token);
        navigate("");
      }
    } catch (error: any) {
      alert("Username or password is not valid!");
    }
  };

  const logOut = () => {
    localStorage.clear();
    setUserId("");
    setToken("");
    navigate("login");
  };

  const authContextValue: AuthContextType = {
    token,
    userId,
    login,
    logOut,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
