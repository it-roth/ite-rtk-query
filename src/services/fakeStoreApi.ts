import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductType, RawProduct } from "@/lib/products";

export type Product = ProductType;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const baseUrl = (process.env.NEXT_PUBLIC_FAKESTORE_BASE_URL);

export const fakeStoreApi = createApi({
  reducerPath: "fakeStoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => "products",
      transformResponse: (response: RawProduct[]) =>
        response.map((item) => ({
          id: item.id,
          name: item.title,
          price: item.price,
          category: item.category,
          image: item.image,
          slug: toSlug(item.title),
        })),
    }),
  }),
});

export const { useGetProductsQuery } = fakeStoreApi;
