import ActiveLink from './ActiveLink';
import {
  faGaugeHigh,
  faCubes,
} from "@fortawesome/free-solid-svg-icons";
import { faList, faBook, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default async function Header() {
  return (
    <nav className="navbar navbar-default" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link href="/" className="navbar-brand" style={{ color: 'white' }}>
            VirbiCoin Pool
          </Link>
        </div>
        <div className="collapse navbar-collapse" id="navbar-collapse">
          <ul className="nav navbar-nav navbar-left">
            <ActiveLink href="/" text="Home" icon={faGaugeHigh} />
            <ActiveLink href="/blocks" text="Blocks" icon={faCubes} />
            <ActiveLink href="/payments" text="Payments" icon={faList} />
            <ActiveLink href="/miners" text="Miners" icon={faBook} />
            <ActiveLink href="/about" text="About" icon={faBook} />
            <ActiveLink href="/help" text="Help" icon={faQuestionCircle} />
          </ul>
          <ul className="nav navbar-nav navbar-right">
          </ul>
        </div>
      </div>
    </nav>
  );
} 