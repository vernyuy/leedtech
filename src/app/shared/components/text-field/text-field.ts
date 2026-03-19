import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CircleAlert,
  Eye,
  EyeOff,
  LucideAngularModule,
  LucideIconData,
} from 'lucide-angular';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'lib-text-field',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NzInputModule,
  ],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextField,
    },
  ],
})
export class TextField implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password' | 'tel' | 'date' | 'number'>('text');
  icon = input<LucideIconData | string | undefined>(undefined);
  fieldIcon = input<LucideIconData | string | undefined>(undefined);
  trailingIcon = input<LucideIconData | string | undefined>(undefined);
  showToggle = input<boolean>(false);
  name = input<string | null>(null);
  id = input<string | null>(null);
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  inputClass = input<string>('');
  wrapperClass = input<string>('');
  size = input<'large' | 'default' | 'small'>('large');
  mask = input<string | null>(null);
  dropSpecialCharacters = input<boolean | null>(null);

  // Accessibility inputs
  ariaLabel = input<string | null>(null);
  ariaDescribedBy = input<string | null>(null);
  ariaInvalid = input<boolean | null>(null);
  ariaRequired = input<boolean | null>(null);
  ariaExpanded = input<boolean | null>(null);
  ariaControls = input<string | null>(null);
  ariaAutocomplete = input<string | null>(null);
  ariaActivedescendant = input<string | null>(null);
  role = input<string | null>(null);
  errorMessage = input<string | null>(null);
  hint = input<string | null>(null);
  autocomplete = input<string | null>(null);
  min = input<string | null>(null);
  max = input<string | null>(null);

  value = '';
  isPasswordVisible = signal<boolean>(false);
  isFocused = false;
  readonly cvaDisabled = signal(false);
  readonly effectiveDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );

  private static nextId = 0;
  readonly inputId = `text-field-${TextField.nextId++}`;
  readonly errorId = `${this.inputId}-error`;
  readonly hintId = `${this.inputId}-hint`;
  readonly errorIcon = CircleAlert;
  readonly eyeIcon = Eye;
  readonly eyeOffIcon = EyeOff;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  displayType = computed(() => {
    if (this.showToggle() && this.type() === 'password') {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  inputType = computed(() => {
    if (this.displayType() === 'email') {
      return 'text';
    }
    return this.displayType();
  });

  readonly resolvedMask = computed(() =>
    this.mask() ?? (this.displayType() === 'tel' ? '(000) 000 0000' : null),
  );

  readonly resolvedDropSpecialCharacters = computed(() => {
    const override = this.dropSpecialCharacters();
    if (override !== null && override !== undefined) {
      return override;
    }
    return this.displayType() === 'tel';
  });

  hasPrefix = computed(() => !!this.icon());

  hasSuffix = computed(
    () => !!this.trailingIcon() || (this.showToggle() && this.type() === 'password'),
  );

  computedAriaDescribedBy = computed<string | null>(() => {
    const ids: string[] = [];

    if (this.ariaDescribedBy()) {
      ids.push(this.ariaDescribedBy() as string);
    }

    if (this.hint()) {
      ids.push(this.hintId);
    }

    if (this.errorMessage() && this.ariaInvalid()) {
      ids.push(this.errorId);
    }

    return ids.length > 0 ? ids.join(' ') : null;
  });

  writeValue(value: string): void {
    if (this.type() === 'tel') {
      const digits = (value ?? '').replace(/\D+/g, '');
      this.value =
        digits.length > 10 && digits.startsWith('1') ? digits.slice(1) : digits;
      return;
    }

    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onInputChange(value: string): void {
    if (this.effectiveDisabled()) {
      return;
    }
    this.value = value ?? '';
    this.onChange(this.value);
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  toggleVisibility(): void {
    if (this.type() !== 'password') {
      return;
    }
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }
}
