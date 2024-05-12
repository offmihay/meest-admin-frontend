import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "./Api";

interface AuthContextType {
  token: string;
  user: any | null;
  loginAction: (userData: any) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string>(
    localStorage.getItem("userID") || ""
  );
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );
  const navigate = useNavigate();

  const loginAction = async (userData: any) => {
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

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
