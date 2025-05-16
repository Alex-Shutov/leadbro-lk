import React from "react";
import { TaskCard } from "./TaskCard";

export const TasksColumn = ({ title, count, tasks, onTaskClick }) => {
  return (
    <div className="tasks__item" style={{ height: "100%" }}>
      <div className="tasks__item-title">
        {title} <span>{count}</span>
      </div>
      <div
        className="tasks__item-column"
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
};
