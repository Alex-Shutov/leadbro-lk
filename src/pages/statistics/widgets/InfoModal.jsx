import React from "react";
import { Modal } from "../../../shared/ui/modal";

export const InfoModal = ({ isOpen, title, description, onClose }) => {
  // {/*TODO - заменить на Icon*/}
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="info-modal">
      <div className="info-modal__title">
        <p>{title}</p>
        <div className="closeModalInfoBtn" onClick={onClose}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.47132 3.52876C4.21097 3.26841 3.78886 3.26841 3.52851 3.52876C3.26816 3.78911 3.26816 4.21122 3.52851 4.47157L7.05712 8.00017L3.52853 11.5288C3.26818 11.7891 3.26818 12.2112 3.52853 12.4716C3.78888 12.7319 4.21099 12.7319 4.47134 12.4716L7.99993 8.94298L11.5285 12.4716C11.7889 12.7319 12.211 12.7319 12.4713 12.4716C12.7317 12.2112 12.7317 11.7891 12.4713 11.5288L8.94274 8.00017L12.4713 4.47157C12.7317 4.21122 12.7317 3.78911 12.4713 3.52876C12.211 3.26841 11.7889 3.26841 11.5285 3.52876L7.99993 7.05737L4.47132 3.52876Z"
              fill="#6F767E"
            />
          </svg>
        </div>
      </div>
      <div className="info-modal__desc">{description}</div>
      <div className="info-modal__btn closeModalInfoBtn" onClick={onClose}>
        Готово
      </div>
    </Modal>
  );
};
