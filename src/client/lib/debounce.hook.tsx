import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";

export const useDebounce = (callback: () => void, debounceTimeMs: number = 1000) => {
  const ref = useRef<any>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, debounceTimeMs);
  }, []);

  return debouncedCallback;
};