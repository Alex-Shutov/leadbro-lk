import { useEffect, RefObject } from "react";

export const useOutsideClick = (ref, handler, exceptions) => {
  useEffect(() => {
    const listener = (event) => {
      const target = event.target;

      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      if (
        exceptions?.some((selector) => {
          const exceptionElement = event.target.closest(selector);
          return exceptionElement && ref.current?.contains(exceptionElement);
        })
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, exceptions]);
};
