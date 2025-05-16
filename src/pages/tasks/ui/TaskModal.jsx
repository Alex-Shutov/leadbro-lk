import React, { useState } from "react";
import {
  TaskModalComments,
  TaskModalContent,
  TaskModalHeader,
  TaskModalSidebar,
} from "../widgets/TaskModal";
import { useTasksStore } from "../state/tasks.store";
import { Modal } from "../../../shared/ui/modal";

export const TaskModal = ({ isOpen, onClose, task }) => {
  const [comment, setComment] = useState("");
  const { addComment, isLoading } = useTasksStore();

  // Если задача не загружена, не отображаем модальное окно
  if (!task) {
    return null;
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const success = await addComment(task.id, comment);
    if (success) {
      setComment("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="tasks-modal">
      <div className="tasks-modal__wrapper">
        <TaskModalHeader title={task.title} />

        <div className="tasks-modal__body">
          <div className="tasks-modal__left">
            <TaskModalContent
              description={task.description}
              tasks={task.tasks}
              additionalInfo={task.additionalInfo}
            />

            <TaskModalComments
              comments={task.comments}
              addComment={handleSubmitComment}
              taskId={task.id}
              isLoading={isLoading}
            />
          </div>

          <TaskModalSidebar
            deadline={task.deadline}
            tag={task.tag}
            createdAt={task.createdAt}
            team={task.team}
          />
        </div>
      </div>
    </Modal>
  );
};
