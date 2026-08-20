import type { ReactElement, ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AdminFormSectionCardTone = 'default' | 'muted' | 'secondary' | 'accent';

type AdminFormSectionCardProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly description?: string;
  readonly id: string;
  readonly title: string;
  readonly tone?: AdminFormSectionCardTone;
};

const toneClassName: Record<AdminFormSectionCardTone, string> = {
  default: 'bg-card',
  muted: 'border-border/80 bg-muted/45',
  secondary: 'border-border/80 bg-secondary/70',
  accent: 'border-border/80 bg-accent/55',
};

/**
 * Card wrapper for long admin CMS forms so each content block is scannable.
 */
export function AdminFormSectionCard({
  children,
  className,
  description,
  id,
  title,
  tone = 'default',
}: AdminFormSectionCardProps): ReactElement {
  return (
    <Card className={cn('scroll-mt-24 shadow-none', toneClassName[tone], className)} id={id}>
      <CardHeader>
        <h2 className="text-lg leading-none font-medium">{title}</h2>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}
