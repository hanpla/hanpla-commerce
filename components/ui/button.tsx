import { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-black border border-transparent shadow-sm",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-transparent",
  outline:
    "bg-transparent text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-300",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 border border-transparent",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-transparent shadow-sm",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs font-medium rounded-md gap-1.5",
  md: "px-4 py-2.5 text-sm font-medium rounded-lg gap-2",
  lg: "px-6 py-3.5 text-base font-semibold rounded-lg gap-2.5",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  type = "button",
  ...props
}: ButtonProps) => {
  const baseClass =
    "inline-flex items-center justify-center font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

  const combinedClassName =
    `${baseClass} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`.trim();

  return (
    <button type={type} disabled={disabled || isLoading} className={combinedClassName} {...props}>
      {isLoading ? (
        <span className="mr-1.5 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
