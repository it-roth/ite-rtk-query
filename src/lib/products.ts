export type RawProduct = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
};

export type ProductType = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  slug: string;
};

export type CreateProductType = {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
};