import React from "react";
import { TasksColumn } from "./TasksColumn";

const TasksColumns = ({ columns, onTaskClick }) => {
  return (
    <>
      {columns.map((column) => (
        <div
          key={column.id}
          style={{
            maxWidth: 300,
            minWidth: "300px",
            marginRight: "8px",
            flex: "1 0 auto",
          }}
        >
          <TasksColumn
            title={column.title}
            count={column.count}
            tasks={column.tasks}
            onTaskClick={onTaskClick}
          />
        </div>
      ))}
    </>
  );
};

export default TasksColumns;
