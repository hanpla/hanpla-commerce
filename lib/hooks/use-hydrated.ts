import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

const useHydrated = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
};

export default useHydrated;
