import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type BaseProps = {
  children?: ReactNode;
  className?: string;
};

export type PolymorphicProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;
