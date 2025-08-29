import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CART_KEY = 'cart_items';
const apiBase = '/api'; // Force use of Vite proxy

export interface CartItem {
  id: string; // productId for frontend compatibility
  productId?: string; // actual productId for backend
  title: string;
  price: number;
  qty: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

// Helper function to make API calls
async function cartApiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${apiBase}/cart${path}`;
  console.log('🛒 Making cart API request to:', url);

  try {
    const res = await fetch(url, { ...opts, headers });
    console.log('📡 Cart API response status:', res.status);

    if (!res.ok) {
      // If backend cart fails, fall back to local storage
      console.log('⚠️ Backend cart unavailable, using local storage fallback');
      throw new Error('Backend cart not available');
    }
    
    const data = await res.json().catch(() => null);
    console.log('✅ Cart API Success:', data);
    return data;
  } catch (error) {
    console.log('❌ Cart API Error, falling back to local storage:', error);
    throw error;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current storage key for guest cart fallback
  const getStorageKey = useCallback(() => {
    return `${CART_KEY}_guest`;
  }, []);

  // Load cart from backend or localStorage
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    
    if (user && user.id) {
      // User is logged in - try to fetch from backend
      try {
        const response = await cartApiFetch('');
        const backendCart = response.cart || [];
        
        // Convert backend format to frontend format
        const frontendCart: CartItem[] = backendCart.map((item: any) => ({
          id: item.productId,
          productId: item.productId,
          title: item.title,
          price: item.price,
          qty: item.qty,
          image: item.image
        }));
        
        setItems(frontendCart);
        console.log('✅ Cart loaded from backend successfully');
      } catch (error) {
        console.log('⚠️ Backend cart unavailable, using local storage fallback');
        // Fallback to localStorage for logged-in users
        loadGuestCart();
      }
    } else {
      // Guest user - use localStorage
      loadGuestCart();
    }
    
    setIsLoading(false);
  }, [user]);

  // Load guest cart from localStorage
  const loadGuestCart = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      const raw = localStorage.getItem(storageKey);
      const cartData = raw ? JSON.parse(raw) : [];
      setItems(cartData);
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setItems([]);
    }
  }, [getStorageKey]);

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    if (!user) {
      try {
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cart_updated'));
      } catch (error) {
        console.error('Error saving guest cart:', error);
      }
    }
  }, [user, getStorageKey]);

  // Migrate guest cart to backend when user logs in
  useEffect(() => {
    const migrateGuestCart = async () => {
      if (user && user.id) {
        try {
          // Get guest cart from localStorage
          const guestKey = getStorageKey();
          const guestCartRaw = localStorage.getItem(guestKey);
          const guestCart: CartItem[] = guestCartRaw ? JSON.parse(guestCartRaw) : [];
          
          if (guestCart.length > 0) {
            // Add each guest cart item to backend
            for (const item of guestCart) {
              try {
                await cartApiFetch('/add', {
                  method: 'POST',
                  body: JSON.stringify({
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    qty: item.qty,
                    image: item.image
                  })
                });
              } catch (error) {
                console.error('Failed to migrate cart item:', item, error);
              }
            }
            
            // Clear guest cart after migration
            localStorage.removeItem(guestKey);
          }
        } catch (error) {
          console.error('Error migrating guest cart:', error);
        }
      }
      
      // Load cart after migration attempt
      await loadCart();
    };

    migrateGuestCart();
  }, [user, loadCart, getStorageKey]);

  // Listen for cart updates from other tabs (only for guest users)
  useEffect(() => {
    if (!user) {
      const handleStorageChange = () => {
        loadGuestCart();
      };

      const handleCartUpdate = () => {
        loadGuestCart();
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('cart_updated', handleCartUpdate);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('cart_updated', handleCartUpdate);
      };
    }
  }, [user, loadGuestCart]);

  const addItem = useCallback(async (item: Omit<CartItem, 'qty'>, qty = 1) => {
    console.log('🛒 Adding item to cart:', item.title, 'qty:', qty);
    
    if (user && user.id) {
      // User is logged in - try backend first, fallback to localStorage
      try {
        const response = await cartApiFetch('/add', {
          method: 'POST',
          body: JSON.stringify({
            productId: item.id,
            title: item.title,
            price: item.price,
            qty,
            image: item.image
          })
        });
        
        // Convert backend response to frontend format
        const backendCart = response.cart || [];
        const frontendCart: CartItem[] = backendCart.map((cartItem: any) => ({
          id: cartItem.productId,
          productId: cartItem.productId,
          title: cartItem.title,
          price: cartItem.price,
          qty: cartItem.qty,
          image: cartItem.image
        }));
        
        setItems(frontendCart);
        console.log('✅ Item added to backend cart successfully');
      } catch (error) {
        console.log('⚠️ Backend cart failed, using local storage fallback');
        // Fallback to localStorage
        setItems(prev => {
          const existingItem = prev.find(p => p.id === item.id);
          let newItems;
          
          if (existingItem) {
            newItems = prev.map(p => 
              p.id === item.id 
                ? { ...p, qty: Math.min(p.qty + qty, 9999) } 
                : p
            );
          } else {
            newItems = [...prev, { ...item, qty }];
          }
          
          saveGuestCart(newItems);
          return newItems;
        });
      }
    } else {
      // Guest user - use localStorage
      setItems(prev => {
        const existingItem = prev.find(p => p.id === item.id);
        let newItems;
        
        if (existingItem) {
          newItems = prev.map(p => 
            p.id === item.id 
              ? { ...p, qty: Math.min(p.qty + qty, 9999) } 
              : p
          );
        } else {
          newItems = [...prev, { ...item, qty }];
        }
        
        saveGuestCart(newItems);
        return newItems;
      });
    }
  }, [user, saveGuestCart]);

  const removeItem = useCallback(async (id: string) => {
    if (user && user.id) {
      // User is logged in - use backend
      try {
        const response = await cartApiFetch(`/remove/${id}`, {
          method: 'DELETE'
        });
        
        // Convert backend response to frontend format
        const backendCart = response.cart || [];
        const frontendCart: CartItem[] = backendCart.map((cartItem: any) => ({
          id: cartItem.productId,
          productId: cartItem.productId,
          title: cartItem.title,
          price: cartItem.price,
          qty: cartItem.qty,
          image: cartItem.image
        }));
        
        setItems(frontendCart);
      } catch (error) {
        console.error('Failed to remove item from backend cart:', error);
      }
    } else {
      // Guest user - use localStorage
      setItems(prev => {
        const newItems = prev.filter(item => item.id !== id);
        saveGuestCart(newItems);
        return newItems;
      });
    }
  }, [user, saveGuestCart]);

  const updateQty = useCallback(async (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }

    if (user && user.id) {
      // User is logged in - use backend
      try {
        const response = await cartApiFetch('/update', {
          method: 'PUT',
          body: JSON.stringify({
            productId: id,
            qty: Math.max(1, Math.min(qty, 9999))
          })
        });
        
        // Convert backend response to frontend format
        const backendCart = response.cart || [];
        const frontendCart: CartItem[] = backendCart.map((cartItem: any) => ({
          id: cartItem.productId,
          productId: cartItem.productId,
          title: cartItem.title,
          price: cartItem.price,
          qty: cartItem.qty,
          image: cartItem.image
        }));
        
        setItems(frontendCart);
      } catch (error) {
        console.error('Failed to update cart item in backend:', error);
      }
    } else {
      // Guest user - use localStorage
      setItems(prev => {
        const newItems = prev.map(item => 
          item.id === id 
            ? { ...item, qty: Math.max(1, Math.min(qty, 9999)) } 
            : item
        );
        saveGuestCart(newItems);
        return newItems;
      });
    }
  }, [user, removeItem, saveGuestCart]);

  const clear = useCallback(async () => {
    if (user && user.id) {
      // User is logged in - use backend
      try {
        await cartApiFetch('/clear', {
          method: 'DELETE'
        });
        setItems([]);
      } catch (error) {
        console.error('Failed to clear backend cart:', error);
      }
    } else {
      // Guest user - use localStorage
      setItems([]);
      try {
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
        window.dispatchEvent(new Event('cart_updated'));
      } catch (error) {
        console.error('Error clearing guest cart:', error);
      }
    }
  }, [user, getStorageKey]);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQty, 
      clear, 
      totalItems, 
      totalPrice,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
