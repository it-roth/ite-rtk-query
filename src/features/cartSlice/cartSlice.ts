import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/services/fakeStoreApi";

export interface CartItem extends Product {
  quantity: number;
}

type CartState = {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
};

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalAmount += newItem.price;
    },
    removeFromCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (!existingItem) return;

      existingItem.quantity -= 1;
      state.totalQuantity = Math.max(0, state.totalQuantity - 1);
      state.totalAmount = Math.max(0, state.totalAmount - existingItem.price);

      if (existingItem.quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      }
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
