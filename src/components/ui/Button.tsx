import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:brightness-110 shadow-lift',
  secondary: 'bg-surface text-ink border border-line hover:border-ink/25',
  ghost: 'text-muted hover:text-ink hover:bg-ink/[0.04]',
  danger: 'text-unhinged hover:bg-unhinged/10',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-xl',
  md: 'h-11 px-5 text-[0.95rem] rounded-2xl',
  lg: 'h-14 px-7 text-base rounded-2xl sm:h-[3.75rem] sm:px-9 sm:text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.975, y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`tap-target inline-flex select-none items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
