import { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  label?: string;
};

const Input = ({ className = "", error, label, id, ...props }: InputProps) => {
  const baseInputClass =
    "w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors duration-150 disabled:bg-neutral-100 disabled:cursor-not-allowed";

  const errorClass = error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "";

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wider text-neutral-700 uppercase"
        >
          {label}
        </label>
      ) : null}
      <input id={id} className={`${baseInputClass} ${errorClass} ${className}`.trim()} {...props} />
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </div>
  );
};

export default Input;
