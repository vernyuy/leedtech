import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'outline'
    | 'link'
    | 'subtle'
    | 'danger'
    | 'unstyled';

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
    selector: 'lib-button',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './button.html',
    styleUrl: './button.css',
})
export class ButtonComponent {
    @Input() type: 'button' | 'submit' = 'button';
    @Input() variant: ButtonVariant = 'primary';
    @Input() disabled = false;
    @Input() fullWidth = true;
    @Input() loading = false;
    @Input() size: ButtonSize = 'md';
    @Input() iconOnly = false;
    @Input() icon: LucideIconData | null = null;
    @Input() iconPosition: 'left' | 'right' = 'left';
    @Input() iconSize = 16;
    @Input() showSpinner = true;
    @Input() className = '';
    @Input('aria-label') ariaLabel: string | null = null;
    @Input('aria-pressed') ariaPressed: boolean | null = null;
    @Input('aria-controls') ariaControls: string | null = null;

    get buttonClasses(): string {
        const base =
            'inline-flex items-center justify-center gap-2.5 transition duration-200 ease-out disabled:cursor-not-allowed';
        const size = this.getSizeClasses();
        const variant = this.getVariantClasses();
        const width = this.fullWidth ? 'w-full' : 'w-auto';
        const iconOnly = this.iconOnly ? 'p-0' : '';
        return [base, size, variant, width, iconOnly, this.className]
            .filter(Boolean)
            .join(' ');
    }

    get spinnerClasses(): string {
        if (this.variant === 'secondary' || this.variant === 'outline' || this.variant === 'link') {
            return 'h-4 w-4 animate-spin rounded-full border-2 border-[#1f2933]/40 border-t-[#1f2933]';
        }
        if (this.variant === 'danger') {
            return 'h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white';
        }
        return 'h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white';
    }

    private getSizeClasses(): string {
        if (this.variant === 'unstyled') {
            return '';
        }
        switch (this.size) {
            case 'sm':
                return 'rounded-md px-3 py-2 text-sm';
            case 'lg':
                return 'rounded-xl px-5 py-4 text-base';
            case 'icon':
                return 'h-9 w-9 rounded-md';
            case 'md':
            default:
                return 'rounded-[10px] px-4 py-3.5 text-[15px]';
        }
    }

    private getVariantClasses(): string {
        switch (this.variant) {
            case 'secondary':
                return [
                    'border border-[#d9e1ec] bg-white text-sky-900 !text-white shadow-none font-bold',
                    'enabled:hover:-translate-y-[1px] enabled:hover:border-[#b8c6d8]',
                    'enabled:hover:shadow-[0_8px_18px_rgba(16,42,67,0.1)]',
                ].join(' ');
            case 'ghost':
                return 'border border-transparent bg-transparent text-slate-700 hover:bg-slate-100 font-semibold';
            case 'outline':
                return 'border border-slate-300 bg-transparent text-slate-700 hover:border-slate-400 hover:bg-slate-50 font-semibold';
            case 'link':
                return 'border border-transparent bg-transparent text-sky-600 hover:text-sky-900 hover:underline font-semibold';
            case 'subtle':
                return 'border border-transparent bg-slate-50 text-slate-900 hover:bg-slate-100 font-semibold';
            case 'danger':
                return 'border border-transparent bg-red-600 !text-white hover:bg-red-700 font-bold';
            case 'unstyled':
                return 'border-0 bg-transparent shadow-none';
            case 'primary':
                 return 'border border-transparent bg-sky-900 !text-white hover:bg-sky-800 font-semibold';
            default:
                return [
                    'border border-transparent bg-sky-900 !text-white shadow-[0_8px_20px_rgba(11,85,141,0.35)] font-bold',
                    'enabled:hover:-translate-y-[1px] enabled:hover:bg-[#08426f]',
                    'enabled:hover:shadow-[0_10px_22px_rgba(11,85,141,0.4)]',
                    'disabled:bg-[#9bb4c9] disabled:shadow-none',
                ].join(' ');
        }
    }

    @Output() clicked = new EventEmitter<Event>();

    onClick(event: Event) {
        if (this.disabled || this.loading) {
            event.preventDefault();
            return;
        }
        this.clicked.emit(event);
    }
}
