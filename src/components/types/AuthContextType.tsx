export interface AuthContextType {
  token: string;
  user: string;
  loginAction: (userData: object) => Promise<void>;
  logOut: () => void;
}
