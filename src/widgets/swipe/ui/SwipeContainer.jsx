// shared/ui/swipe/SwipeContainer.jsx
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./swipe.css";
/**
 * Компонент для обеспечения свайп-функциональности
 *
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Контент для свайпа
 * @param {boolean} props.snapToItem - Должен ли свайп переходить к ближайшему элементу
 * @param {string} props.itemSelector - CSS-селектор для определения элементов для снапа
 * @param {Function} props.onSwipeLeft - Колбэк при свайпе влево
 * @param {Function} props.onSwipeRight - Колбэк при свайпе вправо
 * @param {Function} props.onSnapComplete - Колбэк после привязки к элементу
 * @param {string} props.className - Дополнительные классы
 * @param {React.Ref} ref - Реф для доступа к методам компонента извне
 */
export const SwipeContainer = forwardRef(
  (
    {
      children,
      snapToItem = true,
      itemSelector = ".swiper-slide",
      onSwipeLeft,
      onSwipeRight,
      onSnapComplete,
      className = "",
    },
    ref,
  ) => {
    // Реф для контейнера свайпа
    const containerRef = useRef(null);

    // Состояние свайпа
    const swipeState = useRef({
      isDown: false,
      startX: 0,
      scrollLeft: 0,
      lastScrollPosition: 0,
    });

    // Экспортируем методы через ref
    useImperativeHandle(ref, () => ({
      // Метод для программного перехода к указанному индексу элемента
      swipeTo: (index) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const items = container.querySelectorAll(itemSelector);

        if (!items.length || index < 0 || index >= items.length) return;

        const targetItem = items[index];

        container.scrollTo({
          left: targetItem.offsetLeft,
          behavior: "smooth",
        });
      },

      // Метод для программного перехода к следующему элементу
      swipeNext: () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const items = container.querySelectorAll(itemSelector);

        if (!items.length) return;

        const currentIndex = getCurrentActiveIndex();

        if (currentIndex < items.length - 1) {
          container.scrollTo({
            left: items[currentIndex + 1].offsetLeft,
            behavior: "smooth",
          });

          if (onSwipeLeft && typeof onSwipeLeft === "function") {
            onSwipeLeft(currentIndex + 1);
          }
        }
      },

      // Метод для программного перехода к предыдущему элементу
      swipePrev: () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const items = container.querySelectorAll(itemSelector);

        if (!items.length) return;

        const currentIndex = getCurrentActiveIndex();

        if (currentIndex > 0) {
          container.scrollTo({
            left: items[currentIndex - 1].offsetLeft,
            behavior: "smooth",
          });

          if (onSwipeRight && typeof onSwipeRight === "function") {
            onSwipeRight(currentIndex - 1);
          }
        }
      },

      // Метод для получения текущего активного индекса
      getCurrentIndex: () => getCurrentActiveIndex(),

      // Метод для получения DOM-элемента контейнера
      getElement: () => containerRef.current,
    }));

    // Функция для получения текущего активного индекса
    const getCurrentActiveIndex = () => {
      if (!containerRef.current) return 0;

      const container = containerRef.current;
      const items = container.querySelectorAll(itemSelector);

      if (!items.length) return 0;

      const currentPosition = container.scrollLeft;
      let currentIndex = 0;

      for (let i = 0; i < items.length; i++) {
        if (items[i].offsetLeft > currentPosition) {
          break;
        }
        currentIndex = i;
      }

      return currentIndex;
    };

    // Функция для привязки к ближайшему элементу
    const snapToNearestItem = () => {
      if (!snapToItem || !containerRef.current) return;

      const container = containerRef.current;
      const items = container.querySelectorAll(itemSelector);

      if (!items.length) return;

      const containerLeft = container.scrollLeft;
      const direction =
        containerLeft > swipeState.current.lastScrollPosition
          ? "left"
          : "right";
      swipeState.current.lastScrollPosition = containerLeft;

      let minDistance = Infinity;
      let nearestItem = null;
      let nearestIndex = 0;

      items.forEach((item, index) => {
        const itemLeft = item.offsetLeft;
        const distance = Math.abs(itemLeft - containerLeft);

        if (distance < minDistance) {
          minDistance = distance;
          nearestItem = item;
          nearestIndex = index;
        }
      });

      if (nearestItem) {
        container.scrollTo({
          left: nearestItem.offsetLeft,
          behavior: "smooth",
        });

        // Вызываем соответствующие колбэки
        if (direction === "left" && onSwipeLeft) {
          onSwipeLeft(nearestIndex);
        } else if (direction === "right" && onSwipeRight) {
          onSwipeRight(nearestIndex);
        }

        if (onSnapComplete) {
          onSnapComplete(nearestIndex);
        }
      }
    };

    // Обработчики событий для реализации свайпа
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Предотвращение выделения текста при драге
      const preventTextSelection = (e) => {
        if (swipeState.current.isDown) {
          e.preventDefault();
          return false;
        }
      };

      // Обработчик начала свайпа
      const handleMouseDown = (e) => {
        // Предотвращаем выделение текста
        e.preventDefault();

        swipeState.current.isDown = true;
        container.classList.add("active");
        swipeState.current.startX = e.pageX - container.offsetLeft;
        swipeState.current.scrollLeft = container.scrollLeft;
      };

      // Обработчик окончания свайпа
      const handleMouseUp = () => {
        swipeState.current.isDown = false;
        container.classList.remove("active");
        snapToNearestItem();
      };

      // Обработчик отмены свайпа
      const handleMouseLeave = () => {
        if (swipeState.current.isDown) {
          swipeState.current.isDown = false;
          container.classList.remove("active");
          snapToNearestItem();
        }
      };

      // Обработчик движения во время свайпа
      const handleMouseMove = (e) => {
        if (!swipeState.current.isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - swipeState.current.startX) * 2; // Множитель скорости
        container.scrollLeft = swipeState.current.scrollLeft - walk;
      };

      // Обработчик начала свайпа (тач)
      const handleTouchStart = (e) => {
        swipeState.current.isDown = true;
        container.classList.add("active");
        const touch = e.touches[0] || e.changedTouches[0];
        swipeState.current.startX = touch.pageX - container.offsetLeft;
        swipeState.current.scrollLeft = container.scrollLeft;
      };

      // Обработчик движения во время свайпа (тач)
      const handleTouchMove = (e) => {
        if (!swipeState.current.isDown) return;
        // Не используем preventDefault() здесь, чтобы не блокировать скролл страницы
        const touch = e.touches[0] || e.changedTouches[0];
        const x = touch.pageX - container.offsetLeft;
        const walk = (x - swipeState.current.startX) * 2;
        container.scrollLeft = swipeState.current.scrollLeft - walk;
      };

      // Обработчик окончания свайпа (тач)
      const handleTouchEnd = () => {
        swipeState.current.isDown = false;
        container.classList.remove("active");
        snapToNearestItem();
      };

      // Обработчик скролла для привязки к элементам
      const handleScroll = () => {
        if (swipeState.current.isDown) return; // Не привязываем во время активного свайпа

        clearTimeout(container.scrollTimeout);
        container.scrollTimeout = setTimeout(() => {
          snapToNearestItem();
        }, 150);
      };

      // Обработчик изменения размера окна
      const handleResize = () => {
        snapToNearestItem();
      };

      // Обработчик для блокировки выделения текста
      const handleSelectStart = (e) => {
        if (swipeState.current.isDown) {
          e.preventDefault();
          return false;
        }
      };

      // Регистрируем обработчики
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mousemove", handleMouseMove);

      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd);

      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      // Добавляем обработчик для предотвращения выделения текста
      container.addEventListener("selectstart", handleSelectStart);

      // Отписываемся при размонтировании
      return () => {
        if (container) {
          container.removeEventListener("mousedown", handleMouseDown);
          container.removeEventListener("mouseleave", handleMouseLeave);
          container.removeEventListener("mouseup", handleMouseUp);
          container.removeEventListener("mousemove", handleMouseMove);

          container.removeEventListener("touchstart", handleTouchStart);
          container.removeEventListener("touchmove", handleTouchMove);
          container.removeEventListener("touchend", handleTouchEnd);

          container.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleResize);

          // Удаляем обработчик предотвращения выделения текста
          container.removeEventListener("selectstart", handleSelectStart);

          clearTimeout(container.scrollTimeout);
        }
      };
    }, [snapToItem, itemSelector, onSwipeLeft, onSwipeRight, onSnapComplete]);

    return (
      <div
        ref={containerRef}
        className={`swipe-container ${className}`}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none" /* Firefox */,
          WebkitOverflowScrolling: "touch" /* iOS инерционный скролл */,
          position: "relative",
          cursor: "grab",
        }}
      >
        {children}
      </div>
    );
  },
);
