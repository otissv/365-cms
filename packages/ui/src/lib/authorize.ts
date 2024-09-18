"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function authorize(isLoggedIn = false) {
  return async <Fn extends (...args: any[]) => any>(fn: Fn) =>
    (...args: any[]): ReturnType<Fn> => {
      if (!isLoggedIn) {
        redirect("/")
      }
      const headersList = headers()
      const referer = headersList.get("referer")
      const url = new URL(referer as any)
      const pathname = url.pathname.split(url.host)[0]

      revalidatePath(pathname)
      return fn(...args)
    }
}
