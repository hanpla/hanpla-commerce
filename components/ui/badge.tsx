import { ComponentPropsWithoutRef } from "react";

type BadgeVariant = "default" | "dark" | "discount" | "outline" | "new";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-800 border-transparent",
  dark: "bg-neutral-900 text-white border-transparent",
  discount: "bg-rose-50 text-rose-600 font-bold border-rose-200",
  outline: "bg-transparent text-neutral-600 border-neutral-300",
  new: "bg-emerald-50 text-emerald-700 font-semibold border-emerald-200",
};

const Badge = ({ children, className = "", variant = "default", ...props }: BadgeProps) => {
  const baseClass = "inline-flex items-center px-2 py-0.5 text-xs rounded border transition-colors";
  const combinedClass = `${baseClass} ${VARIANT_CLASSES[variant]} ${className}`.trim();

  return (
    <span className={combinedClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;
