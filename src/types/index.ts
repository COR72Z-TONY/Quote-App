// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ErrorResponse {
  message: string;
}

// Info types
export interface InfoData {
  info: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

// User profile types
export interface UserProfile {
  fullname: string;
  email: string;
}

// Author types
export interface Author {
  authorId: number;
  name: string;
}

// Quote types
export interface Quote {
  quoteId: number;
  authorId: number;
  quote: string;
}

// Auth context types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  currentAuthor: Author | null;
  currentQuote: Quote | null;
  setQuoteData: (author: Author, quote: Quote) => void;
}
