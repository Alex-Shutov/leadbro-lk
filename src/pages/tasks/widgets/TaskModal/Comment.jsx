import React, { useState } from "react";

export const TaskModalComments = ({
  comments = [],
  addComment,
  taskId,
  isLoading,
}) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await addComment(taskId, comment);
      setComment("");
    } catch (error) {
      console.error("Ошибка при отправке комментария:", error);
    }
  };

  return (
    <form className="tasks-modal__form" onSubmit={handleSubmit}>
      <div className="task-modal__title-small">
        Комментарии
        {comments.length > 0 && (
          <span
            style={{ marginLeft: "8px", fontSize: "14px", color: "#6F767E" }}
          >
            ({comments.length})
          </span>
        )}
      </div>

      {comments.length > 0 && (
        <div className="task-modal__comments">
          {comments.map((commentItem, index) => (
            <div
              key={index}
              className="task-modal__comment"
              style={{
                marginBottom: "15px",
                padding: "10px",
                background: "#f4f4f4",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{commentItem.author}</span>
                <span style={{ color: "#6F767E", fontSize: "12px" }}>
                  {commentItem.date}
                </span>
              </div>
              <p>{commentItem.text}</p>
            </div>
          ))}
        </div>
      )}

      <textarea
        className="simple-textarea"
        value={comment}
        onChange={handleCommentChange}
        placeholder="Напишите комментарий..."
        disabled={isLoading}
      ></textarea>
      <button type="submit" disabled={isLoading || !comment.trim()}>
        {isLoading ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
};
