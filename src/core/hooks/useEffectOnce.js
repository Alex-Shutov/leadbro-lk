import { useEffect, useRef } from "react";

export const useEffectOnce = (callback, when) => {
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      callback();
      hasRun.current = true;
    }
  }, [when]);
};
