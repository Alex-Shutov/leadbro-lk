import React from "react";

export const TaskModalContent = ({ description, tasks, additionalInfo }) => {
  return (
    <>
      <p>{description}</p>

      {/*{tasks && tasks.length > 0 && (*/}
      {/*  <div className="tasks-modal__tasks">*/}
      {/*    <div className="task-modal__title-small">Задачи</div>*/}
      {/*    <ul className="task-modal__list">*/}
      {/*      {tasks.map((taskItem, index) => (*/}
      {/*        <li key={index}>{taskItem}</li>*/}
      {/*      ))}*/}
      {/*    </ul>*/}
      {/*  </div>*/}
      {/*)}*/}

      {additionalInfo && (
        <div className="tasks-modal__dop">
          <div className="task-modal__title-small">Дополнительно</div>
          <p>{additionalInfo}</p>
        </div>
      )}
    </>
  );
};
