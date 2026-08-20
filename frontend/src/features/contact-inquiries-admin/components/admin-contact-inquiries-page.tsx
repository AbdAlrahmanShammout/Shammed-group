import { CheckCircle2, Clock, Mail, RefreshCw, XCircle } from 'lucide-react';
import { useState, type ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { useAdminContactInquiriesQuery } from '@/features/contact-inquiries-admin/hooks/use-admin-contact-inquiries-query';
import { useResendInquiryMutation } from '@/features/contact-inquiries-admin/hooks/use-resend-inquiry-mutation';
import type {
  ContactInquiryResponse,
  EmailDeliveryStatus,
} from '@/generated/admin-contact-inquiry.contract';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

const STATUS_LABELS: Record<EmailDeliveryStatus, string> = {
  PENDING: 'Pending',
  SENT: 'Sent',
  FAILED: 'Failed',
};

const STATUS_STYLES: Record<EmailDeliveryStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  SENT: 'bg-green-50 text-green-700 border-green-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
};

function StatusIcon({ status }: { readonly status: EmailDeliveryStatus }): ReactElement {
  if (status === 'SENT') return <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />;
  if (status === 'FAILED') return <XCircle aria-hidden="true" className="h-3.5 w-3.5" />;
  return <Clock aria-hidden="true" className="h-3.5 w-3.5" />;
}

function StatusBadge({ status }: { readonly status: EmailDeliveryStatus }): ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      <StatusIcon status={status} />
      {STATUS_LABELS[status]}
    </span>
  );
}

type InquiryRowProps = {
  readonly inquiry: ContactInquiryResponse;
  readonly onSelect: (inquiry: ContactInquiryResponse) => void;
  readonly isSelected: boolean;
};

function InquiryRow({ inquiry, onSelect, isSelected }: InquiryRowProps): ReactElement {
  return (
    <tr
      className={cn(
        'cursor-pointer border-b transition-colors hover:bg-muted/50',
        isSelected && 'bg-accent/50',
      )}
      onClick={() => onSelect(inquiry)}
    >
      <td className="px-4 py-3 text-sm font-medium text-foreground">{inquiry.fullName}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{inquiry.email}</td>
      <td className="px-4 py-3 text-sm text-foreground">{inquiry.subject}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
        {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={inquiry.emailDeliveryStatus} />
      </td>
    </tr>
  );
}

type InquiryDetailPanelProps = {
  readonly inquiry: ContactInquiryResponse;
  readonly onClose: () => void;
};

function InquiryDetailPanel({ inquiry, onClose }: InquiryDetailPanelProps): ReactElement {
  const resendMutation = useResendInquiryMutation();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{inquiry.subject}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <button
          aria-label="Close"
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3 text-sm">
        <p>
          <span className="font-medium text-foreground">From: </span>
          <span className="text-muted-foreground">{inquiry.fullName}</span>
        </p>
        <p>
          <span className="font-medium text-foreground">Email: </span>
          <a
            className="text-primary hover:underline"
            href={`mailto:${inquiry.email}`}
          >
            {inquiry.email}
          </a>
        </p>
        {inquiry.phone ? (
          <p>
            <span className="font-medium text-foreground">Phone: </span>
            <span className="text-muted-foreground">{inquiry.phone}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Message
        </p>
        <p className="whitespace-pre-wrap rounded-lg border bg-background p-3 text-sm leading-relaxed text-foreground">
          {inquiry.message}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Email delivery
        </p>
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex flex-col gap-0.5">
            <StatusBadge status={inquiry.emailDeliveryStatus} />
            {inquiry.emailDeliveredAt ? (
              <p className="text-xs text-muted-foreground">
                Delivered: {new Date(inquiry.emailDeliveredAt).toLocaleString()}
              </p>
            ) : null}
          </div>
          {inquiry.emailDeliveryStatus === 'FAILED' || inquiry.emailDeliveryStatus === 'PENDING' ? (
            <Button
              disabled={resendMutation.isPending}
              onClick={() => resendMutation.mutate(inquiry.id)}
              size="sm"
              type="button"
              variant="outline"
            >
              <RefreshCw
                aria-hidden="true"
                className={cn('h-3.5 w-3.5', resendMutation.isPending && 'animate-spin')}
              />
              Resend
            </Button>
          ) : null}
        </div>
        {resendMutation.isSuccess ? (
          <p className="text-xs text-green-600">Notification resent successfully.</p>
        ) : null}
        {resendMutation.isError ? (
          <p className="text-xs text-destructive">Failed to resend. Please try again.</p>
        ) : null}
      </div>
    </div>
  );
}

const FILTER_OPTIONS: Array<{ label: string; value: EmailDeliveryStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'Sent', value: 'SENT' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Pending', value: 'PENDING' },
];

export function AdminContactInquiriesPage(): ReactElement {
  const [offset, setOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState<EmailDeliveryStatus | ''>('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryResponse | null>(null);

  const query = useAdminContactInquiriesQuery({
    limit: PAGE_SIZE,
    offset,
    status: statusFilter || undefined,
  });

  const totalPages = Math.max(1, Math.ceil((query.data?.total ?? 0) / PAGE_SIZE));
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  function handleFilterChange(value: EmailDeliveryStatus | ''): void {
    setStatusFilter(value);
    setOffset(0);
    setSelectedInquiry(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Contact Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Messages submitted through the contact form.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                statusFilter === opt.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              key={opt.value}
              onClick={() => handleFilterChange(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Table */}
        <div className="rounded-lg border bg-card shadow-sm">
          {query.isPending ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground" role="status">
              Loading inquiries…
            </div>
          ) : query.isError ? (
            <div className="flex items-center justify-center py-16 text-sm text-destructive" role="alert">
              Failed to load inquiries.
            </div>
          ) : query.data?.inquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <Mail aria-hidden="true" className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">No inquiries yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Name</th>
                      <th className="hidden px-4 py-3 md:table-cell">Email</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="hidden px-4 py-3 lg:table-cell">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {query.data?.inquiries.map((inquiry) => (
                      <InquiryRow
                        inquiry={inquiry}
                        isSelected={selectedInquiry?.id === inquiry.id}
                        key={inquiry.id}
                        onSelect={setSelectedInquiry}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 ? (
                <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
                  <span>
                    Page {currentPage} of {totalPages} — {query.data?.total ?? 0} total
                  </span>
                  <div className="flex gap-2">
                    <Button
                      disabled={offset === 0}
                      onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={currentPage >= totalPages}
                      onClick={() => setOffset((o) => o + PAGE_SIZE)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Detail panel */}
        {selectedInquiry ? (
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <InquiryDetailPanel
              inquiry={selectedInquiry}
              onClose={() => setSelectedInquiry(null)}
            />
          </div>
        ) : (
          <div className="hidden items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground lg:flex">
            Select an inquiry to view details
          </div>
        )}
      </div>
    </div>
  );
}
