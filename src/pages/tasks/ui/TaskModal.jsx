import React, { useEffect, useState } from "react";
import {
  TaskModalComments,
  TaskModalContent,
  TaskModalHeader,
  TaskModalSidebar,
} from "../widgets/TaskModal";
import { useTasksStore } from "../state/tasks.store";
import { Modal } from "../../../shared/ui/modal";
import { mapComments } from "../lib/mapper";

export const TaskModal = ({ isOpen, onClose, task }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { addComment, isLoading, fetchTaskComments } = useTasksStore();

  useEffect(() => {
    if (isOpen && task) {
      const loadComments = async () => {
        const commentsData = await fetchTaskComments(task.id);
        debugger;
        setComments(mapComments(commentsData));
      };
      loadComments();
    }
  }, [isOpen, task]);

  if (!task) {
    return null;
  }

  // Если задача не загружена, не отображаем модальное окно
  if (!task) {
    return null;
  }

  const handleSubmitComment = async (taskId, comment) => {
    const success = await addComment(taskId, comment);
    if (success) {
      setComment("");
      const commentsData = await fetchTaskComments(taskId);
      setComments(mapComments(commentsData));
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
              comments={comments}
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
