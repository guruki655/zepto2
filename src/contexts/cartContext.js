import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addToCart = (product) => {
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.ProductID === product.ProductID);
      const availableStock = parseInt(product.ProductQuantity); 
  
      if (existingItem) {
        if (existingItem.quantity >= availableStock) {
          alert(`Only ${availableStock} in stock.`);
          return prevItems;
        }
  
        return prevItems.map(item =>
          item.ProductID === product.ProductID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.ProductID === productId);
      
      if (existingItem.quantity === 1) {
        return prevItems.filter(item => item.ProductID !== productId);
      }
      
      return prevItems.map(item =>
        item.ProductID === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (parseFloat(item.ProductPrice) * item.quantity),
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};