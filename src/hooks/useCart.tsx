import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      api.get(`/products/${productId}`).then((response) => {
        setCart([...cart, response.data]);

        const storagedCart = localStorage.getItem("@RocketShoes:cart");

        if (storagedCart) {
          const parsedCart = JSON.parse(storagedCart);
          parsedCart.push(response.data);

          localStorage.setItem("@RocketShoes:cart", JSON.stringify(parsedCart));
        } else {
          localStorage.setItem(
            "@RocketShoes:cart",
            JSON.stringify([response.data])
          );
        }
      });
    } catch {
      throw new Error("Não foi possível adicionar o produto ao carrinho");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      api.get(`/products/${productId}`).then((response) => {
        const updatedCart = cart.filter(
          (product) => response.data.id !== product.id
        );

        setCart(updatedCart);

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
      });
    } catch {
      throw new Error("Não foi possível remover o produto do carrinho");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
