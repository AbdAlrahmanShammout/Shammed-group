import { CheckCircle, Palette, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { ColorPickerField } from '@/features/theme-settings/components/color-picker-field';
import { useAdminSiteSettingsQuery } from '@/features/settings/hooks/use-admin-site-settings-query';
import { useUpdateAdminSiteSettingsMutation } from '@/features/settings/hooks/use-update-admin-site-settings-mutation';
import { DEFAULT_COLORS, applyDocumentColors } from '@/lib/apply-document-colors';

type ColorState = {
  primaryColor: string | null;
  accentColor: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  secondaryColor: string | null;
  borderColor: string | null;
};

function initColorState(siteSettings: {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  secondaryColor?: string;
  borderColor?: string;
} | undefined): ColorState {
  return {
    primaryColor: siteSettings?.primaryColor ?? null,
    accentColor: siteSettings?.accentColor ?? null,
    backgroundColor: siteSettings?.backgroundColor ?? null,
    textColor: siteSettings?.textColor ?? null,
    secondaryColor: siteSettings?.secondaryColor ?? null,
    borderColor: siteSettings?.borderColor ?? null,
  };
}

/**
 * Admin page for customising the public website's brand color palette.
 * Colors are stored in SiteSettings and injected as CSS custom properties
 * on the public site shell. Changes preview immediately in the admin panel.
 */
export function AdminThemeSettingsPage(): ReactElement {
  const { data, isPending } = useAdminSiteSettingsQuery();
  const updateMutation = useUpdateAdminSiteSettingsMutation();
  const siteSettings = data?.siteSettings;

  const [colors, setColors] = useState<ColorState>(() => initColorState(siteSettings));
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setColors(initColorState(siteSettings));
  }, [siteSettings]);

  // Live-preview: update CSS variables whenever the local state changes
  useEffect(() => {
    applyDocumentColors(colors);
  }, [colors]);

  const handleColorChange = useCallback(
    (field: keyof ColorState) => (value: string | null) => {
      setColors((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    setIsSuccess(false);
    updateMutation.mutate(
      {
        primaryColor: colors.primaryColor,
        accentColor: colors.accentColor,
        backgroundColor: colors.backgroundColor,
        textColor: colors.textColor,
        secondaryColor: colors.secondaryColor,
        borderColor: colors.borderColor,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3500);
        },
      },
    );
  }, [colors, updateMutation]);

  const handleResetAll = useCallback(() => {
    const reset: ColorState = {
      primaryColor: null,
      accentColor: null,
      backgroundColor: null,
      textColor: null,
      secondaryColor: null,
      borderColor: null,
    };
    setColors(reset);
    updateMutation.mutate({
      primaryColor: null,
      accentColor: null,
      backgroundColor: null,
      textColor: null,
      secondaryColor: null,
      borderColor: null,
    });
  }, [updateMutation]);

  const errorMessage =
    updateMutation.error instanceof ApiError
      ? updateMutation.error.message
      : updateMutation.isError
        ? 'Failed to save colors. Please try again.'
        : null;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Brand Colors</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Customize the color palette used across your public website. Changes preview instantly —
            click <strong>Save changes</strong> to make them permanent.
          </p>
        </div>
        <Button
          disabled={isPending || updateMutation.isPending}
          onClick={handleSave}
          size="sm"
          variant="outline"
          className="shrink-0"
        >
          Reset all to default
        </Button>
      </div>

      {/* Live color palette preview */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="bg-muted/40 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Live preview
        </div>
        <div className="flex flex-wrap gap-0">
          {([
            { key: 'primaryColor', label: 'Primary', fallback: DEFAULT_COLORS.primary },
            { key: 'accentColor', label: 'Accent', fallback: DEFAULT_COLORS.accent },
            { key: 'backgroundColor', label: 'Background', fallback: DEFAULT_COLORS.background },
            { key: 'textColor', label: 'Text', fallback: DEFAULT_COLORS.text },
            { key: 'secondaryColor', label: 'Secondary', fallback: DEFAULT_COLORS.secondary },
            { key: 'borderColor', label: 'Border', fallback: DEFAULT_COLORS.border },
          ] as const).map(({ key, label, fallback }) => {
            const hex = colors[key] ?? fallback;
            return (
              <div key={key} className="flex flex-col items-center gap-1 p-4">
                <div
                  className="h-12 w-12 rounded-lg border border-border shadow-sm"
                  style={{ backgroundColor: hex }}
                />
                <span className="text-center text-[10px] text-muted-foreground">{label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{hex}</span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-border" />

      {/* Color picker fields */}
      <div className="grid gap-8 sm:grid-cols-2">
        <ColorPickerField
          defaultValue={DEFAULT_COLORS.primary}
          description="Main brand color — used for the navigation bar, primary buttons, active states, links, and the admin sidebar."
          label="Primary Color"
          onChange={handleColorChange('primaryColor')}
          value={colors.primaryColor}
        />

        <ColorPickerField
          defaultValue={DEFAULT_COLORS.accent}
          description="Accent / highlight color — used for error states, important indicators, alerts, and secondary call-to-action elements."
          label="Accent Color"
          onChange={handleColorChange('accentColor')}
          value={colors.accentColor}
        />

        <ColorPickerField
          defaultValue={DEFAULT_COLORS.background}
          description="Main page background — applied to the page canvas, cards, and modal pop-overs."
          label="Background Color"
          onChange={handleColorChange('backgroundColor')}
          value={colors.backgroundColor}
        />

        <ColorPickerField
          defaultValue={DEFAULT_COLORS.text}
          description="Default body text color — used for paragraphs, labels, and general content."
          label="Text Color"
          onChange={handleColorChange('textColor')}
          value={colors.textColor}
        />

        <ColorPickerField
          defaultValue={DEFAULT_COLORS.secondary}
          description="Soft tint — used for section backgrounds, card highlights, and subtle UI accents."
          label="Secondary Color"
          onChange={handleColorChange('secondaryColor')}
          value={colors.secondaryColor}
        />

        <ColorPickerField
          defaultValue={DEFAULT_COLORS.border}
          description="Border and divider color — used for input outlines, table rows, and component separators."
          label="Border Color"
          onChange={handleColorChange('borderColor')}
          value={colors.borderColor}
        />
      </div>

      <hr className="border-border" />

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <XCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Brand colors saved successfully.
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button onClick={handleResetAll} type="button" variant="ghost">
          Reset all to defaults
        </Button>
        <Button
          disabled={isPending || updateMutation.isPending}
          onClick={handleSave}
          type="button"
        >
          {updateMutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
