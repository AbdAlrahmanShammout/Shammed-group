import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ColorPickerFieldProps = {
  readonly defaultValue: string;
  readonly description: string;
  readonly label: string;
  readonly onChange: (value: string | null) => void;
  /** Current persisted value from the server. Pass undefined / null to use the default. */
  readonly value: string | null | undefined;
};

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * A single brand-color control: a native color-swatch picker + hex text input
 * with a "Reset to default" button.
 */
export function ColorPickerField({
  defaultValue,
  description,
  label,
  onChange,
  value,
}: ColorPickerFieldProps): ReactElement {
  const effectiveColor = value ?? defaultValue;
  const [hexInput, setHexInput] = useState(effectiveColor);
  const [isValid, setIsValid] = useState(true);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHexInput(effectiveColor);
    setIsValid(true);
  }, [effectiveColor]);

  const handleColorPickerChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = event.target.value;
      setHexInput(newColor);
      setIsValid(true);
      onChange(newColor);
    },
    [onChange],
  );

  const handleHexInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value.trim();
      const withHash = raw.startsWith('#') ? raw : `#${raw}`;
      setHexInput(raw);
      if (HEX_REGEX.test(withHash)) {
        setIsValid(true);
        if (colorInputRef.current) {
          colorInputRef.current.value = withHash;
        }
        onChange(withHash);
      } else {
        setIsValid(raw.length === 0 || false);
      }
    },
    [onChange],
  );

  const handleReset = useCallback(() => {
    setHexInput(defaultValue);
    setIsValid(true);
    onChange(null);
  }, [defaultValue, onChange]);

  const isCustomised = value !== null && value !== undefined && value !== defaultValue;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {isCustomised && (
          <button
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleReset}
            type="button"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to default
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="flex items-center gap-3">
        <div
          className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-border shadow-sm transition-shadow hover:shadow-md"
          onClick={() => colorInputRef.current?.click()}
          style={{ backgroundColor: HEX_REGEX.test(effectiveColor) ? effectiveColor : defaultValue }}
          title="Click to open color picker"
        >
          <input
            ref={colorInputRef}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleColorPickerChange}
            type="color"
            value={HEX_REGEX.test(effectiveColor) ? effectiveColor : defaultValue}
          />
        </div>
        <Input
          className={cn(
            'h-10 font-mono text-sm uppercase',
            !isValid && 'border-destructive focus-visible:ring-destructive',
          )}
          maxLength={7}
          onChange={handleHexInputChange}
          placeholder="#000000"
          value={hexInput}
        />
        {isCustomised && (
          <Button
            className="shrink-0"
            onClick={handleReset}
            size="sm"
            title="Reset to brand default"
            type="button"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
