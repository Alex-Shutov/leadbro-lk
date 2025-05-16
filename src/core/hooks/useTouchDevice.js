import { useEffect } from "react";

export const useTouchDevice = () => {
  useEffect(() => {
    const checkTouchDevice = () => {
      const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
      const mq = (query) => window.matchMedia(query).matches;

      // Проверяем наличие touch событий или DocumentTouch
      const isTouch = "ontouchstart" in window;

      if (isTouch) {
        document.body.classList.add("touch-device");
        return;
      }

      // Проверка через media queries
      const query = [
        "(",
        prefixes.join("touch-enabled),("),
        "heartz",
        ")",
      ].join("");
      if (mq(query)) {
        document.body.classList.add("touch-device");
      }
    };

    checkTouchDevice();
  }, []);
};
