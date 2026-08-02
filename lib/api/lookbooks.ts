"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { MOCK_LOOKBOOKS } from "@/lib/data/mock-lookbooks";
import { LookbookItem } from "@/types/product";

export const getLookbooks = async (): Promise<LookbookItem[]> => {
  cacheLife("hours");
  cacheTag("lookbooks");

  return MOCK_LOOKBOOKS;
};

export const getLookbookById = async (id: string): Promise<LookbookItem | undefined> => {
  cacheLife("hours");
  cacheTag(`lookbook-${id}`, "lookbooks");

  return MOCK_LOOKBOOKS.find((look) => look.id === id);
};
