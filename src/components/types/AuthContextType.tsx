export interface AuthContextType {
  token: string;
  userId: string;
  login: (userData: object) => Promise<void>;
  logOut: () => void;
}
