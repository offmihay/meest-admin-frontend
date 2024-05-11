import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "./Api";

interface AuthContextType {
  token: string;
  user: any | null;
  loginAction: (data: any) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string>(
    localStorage.getItem("username") || ""
  );
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );
  const navigate = useNavigate();

  const loginAction = async (data: any) => {
    try {
      const response = await postJson("users", data);
      if (response.data) {
        setUser(response.data.username);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        navigate("meest-admin/dashboard");
        return;
      } else {
        alert("not valid!!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser("");
    setToken("");
    localStorage.removeItem("username");
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
