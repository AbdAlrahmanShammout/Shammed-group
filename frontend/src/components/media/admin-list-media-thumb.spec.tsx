import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminListMediaThumb } from '@/components/media/admin-list-media-thumb';
import { appEnv } from '@/config/env';

describe('AdminListMediaThumb', () => {
  it('renders the media image when a media id is provided', () => {
    render(<AdminListMediaThumb alt="Partner logo" mediaId={12} objectFit="contain" />);
    expect(screen.getByRole('img', { name: 'Partner logo' })).toHaveAttribute(
      'src',
      `${appEnv.apiBaseUrl}/media/12`,
    );
  });

  it('renders a placeholder when no media id is provided', () => {
    const { container } = render(<AdminListMediaThumb alt="Missing image" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
