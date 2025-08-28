import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

const sizes = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 20,
  xl: 24,
};

export const Icon = ({
  as: IconComponent,
  size = "md",
  className,
  onClick,
  strokeWidth = 2,
}) => {
  if (!IconComponent) return null;
  return (
    <IconComponent
      onClick={onClick}
      width={sizes[size]}
      height={sizes[size]}
      className={cn(className)}
      strokeWidth={strokeWidth}
    />
  );
};
