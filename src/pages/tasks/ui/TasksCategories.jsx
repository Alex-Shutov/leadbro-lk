import React from "react";
import { useTasksStore } from "../state/tasks.store";
import SwiperElement from "../../../widgets/common/ui/SwiperElement";

const TasksCategories = ({
  availableCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { fetchTasks } = useTasksStore();
  const handleClick = (e) => {
    setSelectedCategory(e.key);
    fetchTasks();
  };
  return (
    <SwiperElement
      onClick={handleClick}
      items={availableCategories}
      selectedItem={selectedCategory}
    />
  );
};

export default TasksCategories;
