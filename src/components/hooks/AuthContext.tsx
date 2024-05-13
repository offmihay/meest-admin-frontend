import { createContext } from "react";
import { AuthContextType } from "../types/AuthContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
