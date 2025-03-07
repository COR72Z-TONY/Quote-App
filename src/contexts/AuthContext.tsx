import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getProfile as apiGetProfile,
} from "../services/api";
import { UserProfile, AuthState, Author, Quote } from "../types";
import Cookies from "js-cookie";

// Create the context
const AuthContext = createContext<AuthState | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  // Check for token on initial load
  useEffect(() => {
    const storedToken = Cookies.get("auth_token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // Load user profile
      apiGetProfile()
        .then((userProfile) => {
          setUser(userProfile);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          // If token is invalid, log out
          handleLogout();
        });
    }
  }, []);

  // Login function
  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const newToken = await apiLogin({ email, password });
      setToken(newToken);
      setIsAuthenticated(true);

      // Get user profile after successful login
      const userProfile = await apiGetProfile();
      setUser(userProfile);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Logout function
  const handleLogout = async (): Promise<void> => {
    try {
      if (isAuthenticated) {
        await apiLogout();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove("auth_token");
    }
  };

  // Get user profile
  const handleGetProfile = async (): Promise<void> => {
    try {
      const userProfile = await apiGetProfile();
      setUser(userProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // If token is invalid, log out
      handleLogout();
    }
  };

  const setQuoteData = (author: Author, quote: Quote) => {
    setCurrentAuthor(author);
    setCurrentQuote(quote);
  };

  // Context value
  const value: AuthState = {
    isAuthenticated,
    token,
    user,
    login: handleLogin,
    logout: handleLogout,
    getProfile: handleGetProfile,
    currentAuthor,
    currentQuote,
    setQuoteData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
