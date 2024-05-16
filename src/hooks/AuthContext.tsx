import { createContext } from "react";
import { AuthContextType } from "../components/types/AuthContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
