import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, QuestionMarkCircleIcon, InformationCircleIcon, CubeTransparentIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-100">
              <CubeTransparentIcon className="w-7 h-7 text-gray-100" />
              <span>VirBiCoin Pool</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className={`nav-link flex items-center gap-1 ${pathname === '/' ? 'font-bold !text-gray-100' : '!text-gray-400 hover:!text-gray-300'}`}
              >
                <HomeIcon className="w-5 h-5 text-inherit" /> Dashboard
              </Link>
              <Link
                href="/help"
                className={`nav-link flex items-center gap-1 ${pathname === '/help' ? 'font-bold !text-gray-100' : '!text-gray-400 hover:!text-gray-300'}`}
              >
                <QuestionMarkCircleIcon className="w-5 h-5 text-inherit" /> Getting Started
              </Link>
              <Link
                href="/about"
                className={`nav-link flex items-center gap-1 ${pathname === '/about' ? 'font-bold !text-gray-100' : '!text-gray-400 hover:!text-gray-300'}`}
              >
                <InformationCircleIcon className="w-5 h-5 text-inherit" /> About
              </Link>
              <Link
                href="/blocks"
                className={`nav-link flex items-center gap-1 ${pathname.startsWith('/blocks') ? 'font-bold !text-gray-100' : '!text-gray-400 hover:!text-gray-300'}`}
              >
                <CubeTransparentIcon className="w-5 h-5 text-inherit" /> Pool Blocks
              </Link>
              <Link
                href="/payments"
                className={`nav-link flex items-center gap-1 ${pathname === '/payments' ? 'font-bold !text-gray-100' : '!text-gray-400 hover:!text-gray-300'}`}
              >
                <CurrencyDollarIcon className="w-5 h-5 text-inherit" /> Payments
              </Link>
              <Link
                href="/miners"
                className={`nav-link flex items-center gap-1 ${pathname === '/miners' ? 'font-bold !text-gray-100' : '!text-gray-400 hover:!text-gray-300'}`}
              >
                <UsersIcon className="w-5 h-5 text-inherit" /> Miners
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
} 