import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { AdminMediaUploadField } from '@/components/media/admin-media-upload-field';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';

function renderField(mediaId = '', fileName = ''): {
  readonly onClear: ReturnType<typeof vi.fn>;
  readonly onUploaded: ReturnType<typeof vi.fn>;
} {
  const onClear = vi.fn();
  const onUploaded = vi.fn();
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminMediaUploadField
        fileName={fileName}
        inputId="heroImageUpload"
        label="Hero image"
        mediaId={mediaId}
        onClear={onClear}
        onUploaded={onUploaded}
      />
    </QueryClientProvider>,
  );
  return { onClear, onUploaded };
}

describe('AdminMediaUploadField', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(
          JSON.stringify({
            media: {
              id: 42,
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-01T00:00:00.000Z',
              originalFileName: 'hero.png',
              mimeType: 'image/png',
              byteSize: 128,
            },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );
  });

  afterEach(() => {
    sessionTokenStore.clear();
    vi.unstubAllGlobals();
  });

  it('shows an add button when no image is selected', () => {
    renderField();
    expect(screen.getByRole('button', { name: 'Add image' })).toBeInTheDocument();
    expect(screen.getByText('No image selected')).toBeInTheDocument();
  });

  it('shows a small preview and actions when an image is selected', () => {
    renderField('13', 'hero.jpeg');
    expect(screen.getByRole('img', { name: 'hero.jpeg' })).toHaveAttribute(
      'src',
      `${appEnv.apiBaseUrl}/media/13`,
    );
    expect(screen.getByRole('button', { name: 'Replace' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('uploads a selected file through the media API', async () => {
    const user = userEvent.setup();
    const { onUploaded } = renderField();
    const file = new File(['image-bytes'], 'hero.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Hero image'), file);
    expect(onUploaded).toHaveBeenCalledWith({ mediaId: '42', fileName: 'hero.png' });
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/media`,
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
