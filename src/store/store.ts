import { configureStore } from "@reduxjs/toolkit";
import { countSlice } from "@/features/countSlice/countSlice";
import { cartSlice } from "@/features/cartSlice/cartSlice";
import { fakeStoreApi } from "@/services/fakeStoreApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      count: countSlice.reducer,
      cart: cartSlice.reducer,
      [fakeStoreApi.reducerPath]: fakeStoreApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(fakeStoreApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


