import { useEffect } from "react";

export const useScrollLock = (isLocked) => {
  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (isLocked) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.classList.add("no-scroll");
    } else {
      document.body.style.paddingRight = "";
      document.body.classList.remove("no-scroll");
    }
  }, [isLocked]);
};
