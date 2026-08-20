import type { ReactElement } from 'react';

type AdminPlaceholderPageProps = {
  readonly title: string;
};

export function AdminPlaceholderPage({ title }: AdminPlaceholderPageProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-medium">{title}</h1>
      <p className="text-muted-foreground">This admin screen will be implemented in a later task.</p>
    </div>
  );
}
