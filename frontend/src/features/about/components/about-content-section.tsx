import type { ReactElement } from 'react';

type AboutContentSectionProps = {
  readonly title: string;
  readonly titleId: string;
  readonly body: string;
};

export function AboutContentSection({ title, titleId, body }: AboutContentSectionProps): ReactElement {
  return (
    <section aria-labelledby={titleId} className="border-b last:border-b-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 md:px-6">
        <h2 className="text-2xl font-medium" id={titleId}>
          {title}
        </h2>
        <p className="max-w-3xl whitespace-pre-wrap text-muted-foreground">{body}</p>
      </div>
    </section>
  );
}
