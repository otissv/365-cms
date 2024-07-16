"use client"

import React from "react"

export type ArrayStoreState<Data extends Record<string | number, any>> = {
  data: () => Map<any, Data>
  add: (value: Data[]) => void
  clear: () => void
  delete: (id: string | number | (string | number)[]) => void
  entries: () => [string | number, Data][]
  filter: <
    Fn extends (
      [id, value, prevState]: [
        id: string | number,
        value: Data,
        prevState: Map<any, Data>,
      ],
      index: number
    ) => unknown,
  >(
    callbackfn: Fn,
    thisArg?: any
  ) => unknown[]
  forEach: (
    callbackfn: (
      value: Data,
      id: string | number,
      map: Map<string | number, Data>
    ) => void,
    thisArg?: any
  ) => void
  get: <ID extends keyof Data>(id: ID) => Data | undefined
  has: (id: string | number) => boolean
  keys: () => (string | number)[]
  map: <
    Fn extends (
      [id, value, prevState]: [
        id: string | number,
        value: Data,
        prevState: Map<any, Data>,
      ],
      index: number
    ) => unknown,
  >(
    callbackfn: Fn,
    thisArg?: any
  ) => unknown[]
  reduce: <
    Fn extends (
      previousValue: any,
      currentValue: [string | number, Data],
      prevState: Map<any, Data>,
      index: number
    ) => unknown,
  >(
    callbackfn: Fn,
    thisArg?: any
  ) => ReturnType<Fn>
  replace: (data: Data[]) => void
  set: (id: string | number, value: Data) => void
  size: () => number
  update: (id: string | number, props: Partial<Data>) => void
  values: () => Data[]
}

export type ObjectStoreState<Data extends Record<string, any>> = {
  data: () => Map<keyof Data, Data[keyof Data]>
  clear: () => void
  delete: (id: keyof Data) => void
  entries: () => [string | number, Data][]
  filter: <
    Fn extends (
      [id, value, prevState]: [
        id: string | number,
        value: Data,
        prevState: Map<any, Data>,
      ],
      index: number
    ) => unknown,
  >(
    callbackfn: Fn,
    thisArg?: any
  ) => unknown[]
  forEach: (
    callbackfn: (
      value: Data,
      id: string | number,
      map: Map<string | number, Data>
    ) => void,
    thisArg?: any
  ) => void
  get: <ID extends keyof Data>(id: string) => Data[ID] | undefined
  has: (id: string | number) => boolean
  keys: () => (string | number)[]
  map: <
    Fn extends (
      [id, value, prevState]: [
        id: string | number,
        value: Data,
        prevState: Map<any, Data>,
      ],
      index: number
    ) => unknown,
  >(
    callbackfn: Fn,
    thisArg?: any
  ) => unknown[]
  reduce: <
    Fn extends (
      previousValue: any,
      currentValue: [string | number, Data],
      prevState: Map<any, Data>,
      index: number
    ) => unknown,
  >(
    callbackfn: Fn,
    thisArg?: any
  ) => ReturnType<Fn>
  replace: (data: Data[]) => void
  set: (id: keyof Data, value: Data) => void
  size: () => number
  toObject: () => Data
  update: (id: keyof Data, props: Data[keyof Data]) => void
  values: () => Data[]
}

export const initialObjectStoreState: ObjectStoreState<any> = {
  data: () => new Map(),
  clear: () => undefined,
  delete: (_id) => undefined,
  entries: () => [],
  filter: () => [] as any,
  forEach: () => {},
  get: (_id) => undefined,
  has: () => false,
  keys: () => [],
  map: () => [] as any,
  replace: () => {},
  toObject: () => ({}),
  reduce: (() => {}) as any,
  set: (_id, _data) => undefined,
  size: () => 0,
  update: (_id, _data) => undefined,
  values: () => [],
}

export const initialArrayStoreState: ArrayStoreState<any> = {
  data: () => new Map(),
  add: () => undefined,
  clear: () => undefined,
  delete: (_id) => undefined,
  entries: () => [],
  filter: () => [] as any,
  forEach: () => {},
  get: (_id) => undefined,
  has: () => false,
  keys: () => [],
  map: () => [] as any,
  replace: () => {},
  reduce: (() => {}) as any,
  set: (_id, _data) => undefined,
  size: () => 0,
  update: (_id, _data) => undefined,
  values: () => [],
}

function prepareData<Data extends Record<string, any>>(
  data: Data[],
  key?: string
): [string | number, Data][] {
  return Array.isArray(data) && key
    ? data.map((item) => [item[key], item])
    : data.map((item: Data, index: number) => [index, item])
}

export function useArrayStore<Data extends Record<string, any>>(
  data: Data[],
  key?: string
): ArrayStoreState<Data> {
  const [state, setState] = React.useState(new Map(prepareData(data, key)))

  return {
    data: () => {
      return new Map(state)
    },
    add: (data) => {
      setState((prevMap) => {
        return new Map([
          ...Array.from(prevMap.entries()),
          ...prepareData(data, key),
        ])
      })
    },
    clear: () => {
      return state.clear()
    },
    delete: (id): ReturnType<ArrayStoreState<Data>["delete"]> => {
      setState((prevMap) => {
        const newMap = new Map(prevMap)

        if (Array.isArray(id)) {
          for (const i of id) {
            newMap.delete(i)
          }
        } else {
          newMap.delete(id)
        }

        return newMap
      })
    },
    entries: () => {
      return Array.from(state.entries())
    },
    filter: (fn) => {
      return Array.from(state.entries())
        .filter(([key, value], index) => fn([key, value, state], index))
        .map(([_, value]) => value)
    },
    forEach: (...props) => {
      return state.forEach(...props)
    },
    get: (id): ReturnType<ArrayStoreState<Data>["get"]> => {
      return state.get(id as any)
    },
    has: (id) => {
      return state.has(id as any)
    },
    keys: () => {
      return Array.from(state.keys())
    },
    map: (fn) => {
      const x = Array.from(state.entries()).map(([key, value], index) =>
        fn([key, value, state], index)
      )

      return x
    },
    set: (id, data): ReturnType<ArrayStoreState<Data>["set"]> => {
      setState((prevMap) => new Map(prevMap.set(id, data)))
    },
    size: () => {
      return state.size
    },
    reduce: (callbackfn, initialValue = []) => {
      return Array.from(state.entries()).reduce(
        (previousValue, currentValue, index) => {
          return callbackfn(previousValue, currentValue, state, index)
        },
        initialValue
      )
    },
    replace: (data) => {
      setState(() => new Map(prepareData(data, key)))
    },
    update: (id, data): ReturnType<ArrayStoreState<Data>["update"]> => {
      setState((prevMap) => {
        const item = prevMap.get(id)

        const newItem = {
          ...item,
          ...data,
        } as Data

        return new Map(prevMap.set(id, newItem))
      })
    },
    values: (): ReturnType<ArrayStoreState<Data>["values"]> => {
      return Array.from(state.values())
    },
  }
}

export function useObjectStore<Data extends Record<string, any>>(
  data: Data
): ObjectStoreState<Data> {
  const [state, setState] = React.useState(new Map(Object.entries(data)))

  return {
    data: () => {
      return new Map(state)
    },
    clear: () => {
      return state.clear()
    },
    delete: (id): ReturnType<ObjectStoreState<Data>["delete"]> => {
      setState((prevMap) => {
        const newMap = new Map(prevMap)
        newMap.delete(id as any)
        return newMap
      })
    },
    entries: () => {
      return Array.from(state.entries())
    },
    forEach: (...props) => {
      return state.forEach(...props)
    },
    get: (id): ReturnType<ObjectStoreState<Data>["get"]> => {
      return state.get(id)
    },
    keys: () => {
      return Array.from(state.keys())
    },
    has: (id) => {
      return state.has(id as any)
    },
    filter: (fn) => {
      return Array.from(state.entries())
        .filter(([key, value], index) => fn([key, value, state], index))
        .map(([_, value]) => value)
    },
    map: (fn) => {
      return Array.from(state.entries()).map(([key, value], index) =>
        fn([key, value, state], index)
      )
    },
    reduce: (callbackfn, initialValue = []) => {
      return Array.from(state.entries()).reduce(
        (previousValue, currentValue, index) => {
          return callbackfn(previousValue, currentValue, state, index)
        },
        initialValue
      )
    },
    replace: (data) => {
      setState(() => new Map(Object.entries(data)))
    },
    set: (id, data): ReturnType<ObjectStoreState<Data>["set"]> => {
      setState((prevMap) => new Map(prevMap.set(id as any, data)))
    },
    size: () => {
      return state.size
    },
    toObject: (): ReturnType<ObjectStoreState<Data>["toObject"]> => {
      return Object.fromEntries(state.entries()) as any
    },
    update: (id, data): ReturnType<ObjectStoreState<Data>["update"]> => {
      setState((prevMap) => {
        return new Map(prevMap.set(id as any, data))
      })
    },
    values: (): ReturnType<ArrayStoreState<Data>["values"]> => {
      return Array.from(state.values())
    },
  }
}
