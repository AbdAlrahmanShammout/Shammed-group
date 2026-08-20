import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';

function ConfirmDialogHarness(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)} type="button">
        Open dialog
      </button>
      <ConfirmActionDialog
        description="This permanently deletes the item."
        onCancel={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
        open={isOpen}
        title="Delete item?"
      />
    </div>
  );
}

describe('ConfirmActionDialog', () => {
  it('moves focus into the dialog and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialogHarness />);
    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open dialog' })).toHaveFocus();
  });
});
