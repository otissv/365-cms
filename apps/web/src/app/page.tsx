import { Collections, Collection } from "@/routes"

export default function Page(): JSX.Element {
  return (
    <main>
      <ul>
        <li>
          <Collections.Link>Collections</Collections.Link>
        </li>
        <li>
          <Collection.Link collectionName='testing'>
            Testing collection
          </Collection.Link>
        </li>
      </ul>
    </main>
  )
}
