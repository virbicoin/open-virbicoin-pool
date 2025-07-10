import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import HeaderStats from "@/components/HeaderStats";
import GlobalHealthChecker from "@/components/GlobalHealthChecker";
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { SiGithub, SiX, SiBitcoin, SiDiscord, SiTelegram } from "react-icons/si";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VirBiCoin Pool",
  description: "High performance VirBiCoin mining pool",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <GlobalHealthChecker />
        <header className="bg-gray-900 border-b border-gray-800">
          <nav className="container mx-auto px-2 flex items-center justify-between h-14">
            <Link href="/" className="text-xl font-bold nav-link text-gray-100 hover:text-blue-400 transition-colors">
              VirBiCoin Mining Pool
            </Link>
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="/" className="nav-link text-gray-200 flex items-center gap-1">
                  <HomeIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="nav-link text-gray-200 flex items-center gap-1">
                  <QuestionMarkCircleIcon className="w-5 h-5" />
                  <span>Getting Started</span>
                </Link>
              </li>
              <li><HeaderStats /></li>
              <li>
                <Link href="/payments" className="nav-link text-gray-200 flex items-center gap-1">
                  <CurrencyDollarIcon className="w-5 h-5" />
                  <span>Payments</span>
                </Link>
              </li>
              <li>
                <a href="https://stats.digitalregion.jp/" rel="noopener noreferrer" className="nav-link text-gray-200 flex items-center gap-1">
                  <GlobeAltIcon className="w-5 h-5" />
                  <span>Network</span>
                </a>
              </li>
              <li>
                <Link href="/about" className="nav-link text-gray-200 flex items-center gap-1">
                  <InformationCircleIcon className="w-5 h-5" />
                  <span>About</span>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-2 py-2 flex items-center justify-center text-gray-400">
            <div className="space-x-2 text-sm flex items-center">
              <span>© {new Date().getFullYear()} Digitalregion, Inc.</span>
              <span>|</span>
              <a href="https://github.com/virbicoin/open-virbicoin-pool" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors inline-flex items-center gap-1 align-middle">
                <SiGithub className="w-4 h-4" />
                <span className="align-middle" style={{ verticalAlign: 'middle' }}>open-virbicoin-pool</span>
              </a>
              <span>|</span>
              <span>Pool VBC:</span>
              <a href="https://explorer.digitalregion.jp/address/0x950302976387b43E042aeA242AE8DAB8e5C204D1" target="_blank" rel="noopener noreferrer" className="font-mono hover:text-gray-100 transition-colors">
                0x950302976387b43E042aeA242AE8DAB8e5C204D1
              </a>
              <span>|</span>
              <a href="https://x.com/VirBiCoin" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">
                <SiX className="w-4 h-4" />
              </a>
              <span>|</span>
              <a href="https://bitcointalk.org/index.php?topic=5546988.0" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">
                <SiBitcoin className="w-4 h-4" />
              </a>
              <span>|</span>
              <a href="https://discord.digitalregion.jp" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">
                <SiDiscord className="w-4 h-4" />
              </a>
              <span>|</span>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 transition-colors">
                <SiTelegram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
