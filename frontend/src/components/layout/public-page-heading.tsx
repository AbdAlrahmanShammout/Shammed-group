import type { ReactElement } from 'react';

type PublicPageHeadingProps = {
  readonly title: string;
};

export function PublicPageHeading({ title }: PublicPageHeadingProps): ReactElement {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="text-3xl font-medium">{title}</h1>
    </div>
  );
}
