export function deepCompareObjects(obj1: unknown) {
  return (obj2: unknown) => {
    if (obj1 === obj2) return true
    if (typeof obj1 !== typeof obj2) return false
    if (
      obj1 == null ||
      obj2 == null ||
      typeof obj1 !== "object" ||
      typeof obj2 !== "object"
    )
      return obj1 === obj2

    const keys1 = Object.keys(obj1).sort()
    const keys2 = Object.keys(obj2).sort()
    if (keys1.length !== keys2.length) return false

    for (const key of keys1) {
      if (
        !keys2.includes(key) ||
        !deepCompare((obj1 as any)[key])((obj2 as any)[key])
      )
        return false
    }
    return true
  }
}

function deepCompare(value1: unknown) {
  return (value2: unknown) => {
    if (value1 === value2) return true
    if (typeof value1 !== typeof value2) return false
    if (
      value1 == null ||
      value2 == null ||
      typeof value1 !== "object" ||
      typeof value2 !== "object"
    )
      return value1 === value2
    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (value1.length !== value2.length) return false
      for (let i = 0; i < value1.length; i++) {
        if (!deepCompare(value1[i])(value2[i])) return false
      }
      return true
    }
    if (isObject(value1) && isObject(value2)) {
      return deepCompareObjects(value1)(value2)
    }
    return false
  }
}

function isObject(object: unknown) {
  return object != null && typeof object === "object"
}

export function compareCollections(col1: unknown) {
  return (col2: unknown) => {
    if (
      !Array.isArray(col1) ||
      !Array.isArray(col2) ||
      col1.length !== col2.length
    ) {
      return false
    }
    for (let i = 0; i < col1.length; i++) {
      if (!deepCompare(col1[i])(col2[i])) return false
    }
    return true
  }
}

export function isObjectInCollectionByProperty(col1: unknown) {
  return (col2: unknown) => (propertyName: string) =>
    Array.isArray(col1) && Array.isArray(col2)
      ? col1.some((obj1) =>
          col2.some((obj2) => obj1[propertyName] === obj2[propertyName])
        )
      : false
}
