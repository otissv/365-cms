export const builtinColumns = [
  "createdBy",
  "createdAt",
  "updatedBy",
  "updatedAt",
]

export function notBuiltInColumns(value: string) {
  return !builtinColumns.includes(value)
}
