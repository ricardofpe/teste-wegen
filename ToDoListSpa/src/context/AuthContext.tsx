import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";
import { jwtDecode } from "jwt-decode";

interface UserData {
  username: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserData | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, passwordHash: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("/Auth/profile");
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthToken(null);
      localStorage.removeItem("token");
      setUser(null);
      return false;
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/Auth/login", { username, password });
      const token = response.data.token;
      setAuthToken(token);
      localStorage.setItem("token", token);
      const isLogged = await fetchUserData();
      setIsLoggedIn(isLogged);
      navigate("/tasks");
    } catch (error: any) {
      console.error("Login failed:", error.response.data);
      throw error;
    }
  };

  const register = async (username: string, passwordHash: string) => {
    try {
      await api.post("/Auth/register", {
        username,
        PasswordHash: passwordHash,
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Login failed:", error.response.data);
      throw error;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    const validateToken = async (token: string) => {
      try {
        const decodedToken: any = jwtDecode(token);
        const isTokenExpired = decodedToken.exp < Date.now() / 1000;

        if (isTokenExpired) {
          logout();
        } else {
          setAuthToken(token);
          const isLogged = await fetchUserData();
          if (isLogged) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Error validating token:", error);
        logout();
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (savedToken) {
      validateToken(savedToken);
    } else {
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  }, [logout]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoggedIn, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
