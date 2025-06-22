'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type ActiveLinkProps = LinkProps & {
  children?: ReactNode;
  activeClassName?: string;
  includePaths?: string[];
  text?: string;
  icon?: IconDefinition;
  badge?: number | string;
};

const ActiveLink = ({ children, activeClassName = 'active', includePaths = [], text, icon, badge, ...props }: ActiveLinkProps) => {
  const pathname = usePathname();
  const href = typeof props.href === 'object' ? props.href.pathname || '' : props.href;

  let isActive = href === '/' ? pathname === href : pathname.startsWith(href);

  if (includePaths && includePaths.some(path => pathname.startsWith(path))) {
    isActive = true;
  }

  return (
    <li className={isActive ? activeClassName : ''}>
      <Link {...props}>
        {icon && <FontAwesomeIcon icon={icon} fixedWidth />} {text} {children}
        {badge !== undefined && <span className="badge">{badge}</span>}
      </Link>
    </li>
  );
};

export default ActiveLink; 