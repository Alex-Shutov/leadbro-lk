import React from "react";

const LockedCard = ({ label, onClick = () => null }) => {
  return (
    <div className="total card">
      <img src="img/custom/Locked.svg" alt="" />
      <a onClick={onClick} className="requests__titles-btn">
        {label}
      </a>
    </div>
  );
};

export default LockedCard;
