import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import ActiveLink from "@/components/ActiveLink";
import Script from "next/script";
import { getStats } from "@/lib/api";
import { faGithub, faDiscord, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGaugeHigh, faRocket, faCreditCard, faNetworkWired, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import HeaderStats from "@/components/HeaderStats";

config.autoAddCss = false;

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
  await getStats();
  return (
    <html lang="en">
      <head>
        <style>{dom.css()}</style>
      </head>
      <body className={inter.className}>
        <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target=".navbar-collapse"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" href="/">
                <span className="logo-text" style={{ color: 'white' }}>VirBiCoin Mining Pool</span>
              </Link>
            </div>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <ActiveLink href="/" icon={faGaugeHigh}>Dashboard</ActiveLink>
                <ActiveLink href="/help" icon={faRocket}>Getting Started</ActiveLink>
                <HeaderStats />
                <ActiveLink href="/payments" icon={faCreditCard}>Payments</ActiveLink>
                <li><a href="https://stats.digitalregion.jp/" rel="noopener noreferrer"><FontAwesomeIcon icon={faNetworkWired} fixedWidth /> Network</a></li>
                <ActiveLink href="/about" icon={faCircleInfo}>About</ActiveLink>
              </ul>
            </div>
          </div>
        </div>
        <div className="main-content">{children}</div>
        <footer className="footer">
          <div className="container">
            <p className="text-muted text-center" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ color: '#ccc' }}>© {new Date().getFullYear()} Digitalregion, Inc.</span> |
              <a href="https://github.com/virbicoin/open-virbicoin-pool" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', textDecoration: 'none', margin: '0 4px' }}>
                <FontAwesomeIcon icon={faGithub} style={{ marginRight: 4 }} />open-virbicoin-pool
              </a>
              |
              <span style={{ color: '#ccc' }}>Pool VBC:</span> <a href="https://explorer.digitalregion.jp/address/0x950302976387b43E042aeA242AE8DAB8e5C204D1" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', textDecoration: 'none', margin: '0 4px' }}>
                0x950302976387b43E042aeA242AE8DAB8e5C204D1
              </a>
              |
              <a href="https://x.com/VirBiCoin" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', margin: '0 4px' }}>
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="https://bitcointalk.org/index.php?topic=5546988.0" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', margin: '0 4px', display: 'inline-flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 32 32" style={{ marginRight: 2, verticalAlign: 'middle' }}><circle cx="16" cy="16" r="16" fill="#ccc"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#333" fontFamily="Arial">B</text></svg>
              </a>
              <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', margin: '0 4px' }}>
                <FontAwesomeIcon icon={faDiscord} />
              </a>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', margin: '0 4px' }}>
                <FontAwesomeIcon icon={faTelegram} />
              </a>
            </p>
          </div>
        </footer>
        <Script id="jquery" src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossOrigin="anonymous" strategy="beforeInteractive"></Script>
        <Script id="bootstrap-js" src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossOrigin="anonymous" strategy="beforeInteractive"></Script>
      </body>
    </html>
  );
}
