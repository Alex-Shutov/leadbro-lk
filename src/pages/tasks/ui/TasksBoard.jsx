import React, { useRef, useEffect, useCallback } from "react";
import { useTasksStore } from "../state/tasks.store";
import TasksCategories from "./TasksCategories";
import { SwipeContainer } from "../../../widgets/swipe/ui/SwipeContainer";
import TasksColumns from "./TasksColumns";
import { Select } from "../../../shared/ui/select";
import { debounce } from "lodash";

export const TasksBoard = ({ onTaskClick }) => {
  const {
    fetchTasks,
    columns,
    categories,
    selectedCategory,
    months,
    selectedMonth,
    setSelectedCategory,
    setSelectedMonth,
    isLoading,
  } = useTasksStore();

  const categoriesSwipeRef = useRef(null);
  const categoriesContainerRef = useRef(null);
  const isUserScroll = useRef(false);

  // Обработчик свайпа/скролла с debounce
  const handleScroll = useCallback(
    debounce(() => {
      if (!categoriesContainerRef.current || !isUserScroll.current) return;

      const container = categoriesContainerRef.current;
      const items = container.querySelectorAll(".swiper-slide");
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;

      let nearestIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemLeft = item.offsetLeft;
        const itemRight = itemLeft + item.offsetWidth;
        const distance = Math.abs(scrollLeft - itemLeft);

        if (
          (scrollLeft >= itemLeft && scrollLeft < itemRight) ||
          distance < minDistance
        ) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      // Плавная фиксация на ближайшем элементе
      container.scrollTo({
        left: items[nearestIndex].offsetLeft,
        behavior: "smooth",
      });

      setSelectedCategory(categories[nearestIndex].key);
      isUserScroll.current = false;
    }, 300),
    [categories, setSelectedCategory],
  );

  // Обработчик клика по категории
  const handleCategoryClick = useCallback(
    (key, index) => {
      debugger;
      const newCategory = selectedCategory === key ? null : key;
      if (!categoriesContainerRef.current) return;

      const container = categoriesContainerRef.current;
      const items = container.querySelectorAll(".swiper-slide");

      if (items[index]) {
        container.scrollTo({
          left: items[index].offsetLeft,
          behavior: "smooth",
        });
      }

      setSelectedCategory(newCategory);
      fetchTasks();
    },
    [fetchTasks, setSelectedCategory, selectedCategory],
  );

  // Синхронизация скролла при изменении категории
  useEffect(() => {
    if (!categoriesContainerRef.current || !selectedCategory) return;

    const index = categories.findIndex((cat) => cat.key === selectedCategory);
    if (index === -1) return;

    const container = categoriesContainerRef.current;
    const items = container.querySelectorAll(".swiper-slide");

    if (items[index]) {
      container.scrollTo({
        left: items[index].offsetLeft,
        behavior: "smooth",
      });
    }
  }, [selectedCategory, categories]);

  return (
    <>
      <div className="shop__control">
        <div className="shop__nav shop__nav-select">
          <Select
            options={months}
            value={selectedMonth}
            onChange={setSelectedMonth}
          />
        </div>
      </div>

      <div className="shop__control">
        <div className="shop__nav shop__nav-links">
          <div
            ref={categoriesContainerRef}
            className="shop-links__wrap"
            style={{
              overflowX: "auto",
              display: "flex",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
            }}
            onScroll={() => {
              isUserScroll.current = true;
              handleScroll();
            }}
          >
            <TasksCategories
              setSelectedCategory={handleCategoryClick}
              availableCategories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </div>
      </div>

      <div className="tasks__wrap">
        {isLoading ? (
          <div className="loading-placeholder">Загрузка задач...</div>
        ) : columns.length === 0 ? (
          <div className="empty-placeholder">Задачи не найдены</div>
        ) : (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            <TasksColumns columns={columns} onTaskClick={onTaskClick} />
          </div>
        )}
      </div>
    </>
  );
};
