import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCart } from '../services/carts.service';

const CART_ID_KEY = 'ACTIVE_CART_ID';

type CartContextType = {
  cart: any | null;
  setCart: (cart: any | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: any) => {
  const [cart, setCartState] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const setCart = async (cart: any | null) => {
    setCartState(cart);

    if (cart?.id) {
      await AsyncStorage.setItem(CART_ID_KEY, cart.id);
    } else {
      await AsyncStorage.removeItem(CART_ID_KEY);
    }
  };

  useEffect(() => {
    const restoreCart = async () => {
      const cartId = await AsyncStorage.getItem(CART_ID_KEY);

      if (cartId) {
        const res = await getCart(cartId);
        setCartState(res?.data?.cart ?? null);
      }

      setLoading(false);
    };

    restoreCart();
  }, []);

  if (loading) return null; // hoặc splash screen

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
