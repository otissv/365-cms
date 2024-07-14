function parseIfJson(value: any): any[] | Record<string, any> {
  try {
    return JSON.parse(value)
  } catch (_) {
    return value
  }
}

function stringify(value: any): string {
  return typeof value !== "string" ? JSON.stringify(value) : value
}

export function createQueryString<Params extends Record<string, any>>(
  params: Params
): string {
  const searchParams = new URLSearchParams()
  for (const [name, value] of Object.entries(params)) {
    if (typeof value !== "undefined") {
      searchParams.set(name, stringify(value))
    }
  }

  return searchParams.toString()
}
export function decodeSearchParams(
  searchParams: Record<string, any> = {}
): Record<string, any> {
  const params: Record<string, any> = {}

  for (const [name, value] of Object.entries(searchParams)) {
    params[name] = parseIfJson(value)
  }
  return params
}
