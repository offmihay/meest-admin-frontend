import { createContext } from "react";
import { AuthContextType } from "../utils/types/AuthContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
