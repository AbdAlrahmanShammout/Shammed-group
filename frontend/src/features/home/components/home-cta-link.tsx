import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { isInternalAppPath } from '@/features/home/lib/is-internal-app-path';

type HomeCtaLinkProps = {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: 'default' | 'outline' | 'secondary';
};

export function HomeCtaLink({ href, children, variant = 'default' }: HomeCtaLinkProps): ReactElement {
  if (isInternalAppPath(href)) {
    return (
      <Button asChild variant={variant}>
        <Link to={href}>{children}</Link>
      </Button>
    );
  }
  return (
    <Button asChild variant={variant}>
      <a href={href} rel="noreferrer noopener">
        {children}
      </a>
    </Button>
  );
}
