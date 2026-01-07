import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import type { User } from '../lib/api-client';
import { SecureStorage } from '../lib/storage';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  store: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cart: CartItem[];
  favorites: string[]; // Array of product IDs
  language: 'en' | 'af';
  theme: 'light' | 'dark';
  isLoading: boolean;
}

// Actions
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_FAVORITES'; payload: string }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'af' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  favorites: [],
  language: 'en',
  theme: 'light',
  isLoading: false,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
      };

    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        item => item.productId === action.payload.productId
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          cart: updatedCart,
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      }

    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };

    case 'ADD_TO_FAVORITES':
      if (!state.favorites.includes(action.payload)) {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }
      return state;

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };

    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };

    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  setLanguage: (language: 'en' | 'af') => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await SecureStorage.getAuthToken();
        const user = await SecureStorage.getUserData<User>();
        
        if (token && user) {
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        // Silent fail
      }
    };
    
    loadUserData();
  }, []);

  // Helper functions
  const login = async (user: User) => {
    try {
      await SecureStorage.setUserData(user);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStorage.clearAuth();
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_FAVORITES', payload: [] });
    } catch (error) {
      throw error;
    }
  };

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.productId}_${Date.now()}`,
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity } });
    }
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleFavorite = (productId: string) => {
    if (state.favorites.includes(productId)) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
    } else {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: productId });
    }
  };

  const isFavorite = (productId: string) => {
    return state.favorites.includes(productId);
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const setLanguage = (language: 'en' | 'af') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    toggleFavorite,
    isFavorite,
    getCartTotal,
    getCartItemCount,
    setLanguage,
    setTheme,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Translations
export const translations = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Navigation
    home: 'Home',
    categories: 'Categories',
    cart: 'Cart',
    favorites: 'Favorites',
    profile: 'Profile',
    
    // Onboarding
    skip: 'Skip',
    next: 'Next',
    getStarted: 'Get Started',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    
    // Shopping
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    price: 'Price',
    rating: 'Rating',
    reviews: 'Reviews',
    
    // Cart
    emptyCart: 'Your cart is empty',
    checkout: 'Checkout',
    total: 'Total',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    
    // Profile
    editProfile: 'Edit Profile',
    orderHistory: 'Order History',
    addresses: 'Addresses',
    paymentMethods: 'Payment Methods',
    settings: 'Settings',
    logout: 'Logout',
  },
  af: {
    // Common
    loading: 'Laai...',
    error: 'Fout',
    success: 'Sukses',
    cancel: 'Kanselleer',
    confirm: 'Bevestig',
    save: 'Stoor',
    delete: 'Verwyder',
    edit: 'Wysig',
    search: 'Soek',
    filter: 'Filter',
    sort: 'Sorteer',
    
    // Navigation
    home: 'Tuis',
    categories: 'Kategorieë',
    cart: 'Mandjie',
    favorites: 'Gunstelinge',
    profile: 'Profiel',
    
    // Onboarding
    skip: 'Slaan oor',
    next: 'Volgende',
    getStarted: 'Begin',
    
    // Auth
    login: 'Meld aan',
    signup: 'Registreer',
    email: 'E-pos',
    password: 'Wagwoord',
    forgotPassword: 'Wagwoord vergeet?',
    
    // Shopping
    addToCart: 'Voeg by mandjie',
    buyNow: 'Koop nou',
    inStock: 'In voorraad',
    outOfStock: 'Uit voorraad',
    price: 'Prys',
    rating: 'Gradering',
    reviews: 'Resensies',
    
    // Cart
    emptyCart: 'Jou mandjie is leeg',
    checkout: 'Afhandel',
    total: 'Totaal',
    subtotal: 'Subtotaal',
    deliveryFee: 'Afleweringsfooi',
    
    // Profile
    editProfile: 'Wysig profiel',
    orderHistory: 'Bestellingsgeskiedenis',
    addresses: 'Adresse',
    paymentMethods: 'Betaalmetodes',
    settings: 'Instellings',
    logout: 'Meld af',
  },
};