import { ComponentPropsWithoutRef } from "react";

const TagPinIcon = ({ className = "w-5 h-5", ...props }: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
};

export default TagPinIcon;
