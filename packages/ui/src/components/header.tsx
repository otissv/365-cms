import Link from "next/link"
// import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { ThemeToggle } from "@ui/components/theme-toggle"
// import { Button } from "@ui/ui/button"
// import { auth } from '@clerk/nextjs/server'

export default function Header(): JSX.Element {
  return (
    <header className='py-4'>
      <MainNav />
    </header>
  )
}

function MainNav(): JSX.Element {
  const isLoggedIn = true // auth().userId

  return !isLoggedIn ? (
    <nav className='container flex items-center justify-between'>
      <ul className='flex gap-10 text-sm font-medium'>
        <li>
          <Link href='/'>Home</Link>
        </li>
      </ul>

      <div className='flex items-center justify-between gap-6'>
        {/* <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm">Sign in</Button>
          </SignInButton>
        </SignedOut> */}

        <ThemeToggle />
      </div>
    </nav>
  ) : (
    <nav className='container flex items-center justify-between'>
      <ul className='flex gap-10 text-sm font-medium'>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/cms'>CMS</Link>
        </li>
      </ul>

      <div className='flex items-center justify-between gap-6'>
        <ThemeToggle />

        {/* <SignedIn>
          <UserButton />
        </SignedIn> */}
      </div>
    </nav>
  )
}
