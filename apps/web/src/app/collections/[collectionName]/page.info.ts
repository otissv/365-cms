import { z } from "zod"

export const Route = {
  name: "Collection",
  params: z.object({
    collectionName: z.string(),
  }),
}
