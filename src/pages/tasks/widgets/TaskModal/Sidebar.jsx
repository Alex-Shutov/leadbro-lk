import React from "react";

export const TaskModalSidebar = ({ tag, createdAt, team = [], deadline }) => {
  return (
    <div className="tasks-modal__right">
      {tag && <div className={`tasks-modal__tag _${tag.type}`}>{tag.text}</div>}

      <div className="tasks-modal__date">
        <p>Дедлайн</p>
        <span>{deadline}</span>
      </div>

      {team.length > 0 && (
        <div className="tasks-modal__team">
          <p>Команда проекта</p>
          <div className="task-modal__team-workers">
            {team.map((member) => (
              <div className="task-modal__worker" key={member.id}>
                <div className="task-modal__worker-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="task-modal__worker-info">
                  <p>{member.name}</p>
                  <span>{member.position}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
