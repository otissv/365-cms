// import { auth } from '@clerk/nextjs/server'
import { revalidatePath as revalidateCachePath } from "next/cache"
import config from "@/config"

export function authorize<
  Fn extends (...args: any[]) => Promise<any>,
  ExtendNone extends Record<string, any>,
>(
  fn: Fn,
  //@ts-expect-error "different subtype of constraint" can be ignored as ExtendNone is added to exiting return type to ensure correct return type
  extendNone: ExtendNone = {}
) {
  return async (
    ...args: any[]
  ): Promise<
    | ReturnType<Fn>
    | ({
        data: []
        error: string
      } & ExtendNone)
  > => {
    //TODO: remove when add back authorization
    // const userId =auth().userId
    const userId = 1

    try {
      const isLoggedIn = true // Boolean(userId)

      if (!isLoggedIn)
        return {
          ...extendNone,
          data: [],
          error: "Unauthorized access",
        }

      //TODO: ADD ACL Check HERE

      const revalidatePath: string = args.slice(args.length - 1)[0]
      revalidatePath && revalidateCachePath(revalidatePath)

      const props = args.slice(0, args.length - 1)

      return await fn(...props, { userId })
    } catch (error) {
      if (config.isDev) {
        console.error(error)
      }

      return {
        ...extendNone,
        data: [],
        error: "Bad request",
      }
    }
  }
}
