import React from "react";

export const TaskCard = ({ task, onClick }) => {
  return (
    <div className="tasks__card" onClick={onClick}>
      <div className="tasks__card-top">
        <p>{task.title}</p>
      </div>
      <div className="tasks__card-bottom">
        <div className={`tasks__card-tag _${task.tag.type}`}>
          {task.tag.text}
        </div>
        <div className="tasks__card-users user-wrap">
          {task.users &&
            task.users.map((user, index) => (
              <div
                key={user.id || index}
                data-num={index}
                className="user-circle"
              >
                <img src={user.image} alt={user.name || "User"} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
