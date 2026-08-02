"use server";

import { revalidateTag, updateTag } from "next/cache";

export const revalidateProductsTag = async (): Promise<void> => {
  revalidateTag("products", "default");
};

export const updateProductsTag = async (): Promise<void> => {
  updateTag("products");
};
