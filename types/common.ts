import { ComponentPropsWithoutRef, ReactNode } from "react";

export type BaseProps = {
  children?: ReactNode;
  className?: string;
};

export type PolymorphicProps<T extends React.ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;
