import type { SearchParams } from "@repo/cms/types.cms"
import { maybeNumber } from "@repo/lib/maybeNumber"

export function searchParamsWithDefaults(searchParams: SearchParams) {
  const page = maybeNumber(1)(Number(searchParams.page))
  const limit = maybeNumber(10)(Number(searchParams.limit))
  const layout = searchParams.layout || "grid"
  const sortBy = searchParams.sortBy || "createdAt"
  const nulls = (searchParams.nulls || "last") as "first" | "last"
  const direction = searchParams.direction || "desc"

  return {
    page,
    limit,
    sortBy,
    direction,
    nulls,
    layout,
  }
}
