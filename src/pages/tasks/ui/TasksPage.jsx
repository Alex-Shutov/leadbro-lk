import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../../shared/ui/layout";
import { TasksBoard } from "./TasksBoard";
import { TaskModal } from "./TaskModal";
import { useTasksStore } from "../state/tasks.store";

export const TasksPage = () => {
  const { id: serviceId } = useParams();
  const { setServiceId, fetchTasksByService, fetchCategories, fetchMonths } =
    useTasksStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Инициализация данных при загрузке страницы
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted && serviceId) {
        setServiceId(serviceId);
        await fetchTasksByService(serviceId);
        await fetchCategories();
        await fetchMonths();
      }
    };

    loadData();
  }, [
    serviceId,
    setServiceId,
    fetchTasksByService,
    fetchCategories,
    fetchMonths,
  ]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <Layout>
      <div className="page__inner tasks-page" style={{ background: "#f4f4f4" }}>
        <TasksBoard onTaskClick={handleTaskClick} />
        {isModalOpen && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            task={selectedTask}
          />
        )}
      </div>
    </Layout>
  );
};
