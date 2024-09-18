import { Button } from "@repo/ui/button"
import Link from "next/link"

export default function Page(): JSX.Element {
  return (
    <main>
      <ul>
        <li>
          <Link href={"/collections"}>Collections</Link>
        </li>
        <li>
          <Link href={"/collections/testing"}>Testing collection</Link>
        </li>
      </ul>
    </main>
  )
}
