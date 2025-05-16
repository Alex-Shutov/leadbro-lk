import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../icon";

export const Modal = ({ isOpen, onClose, children, className = "" }) => {
  useEffect(() => {
    const handleEscapePress = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.classList.contains("modal-overlay") && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapePress);
    document.addEventListener("click", handleClickOutside);

    if (isOpen) {
      document.body.classList.add("_modal-locked");
    }

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
      document.removeEventListener("click", handleClickOutside);
      document.body.classList.remove("_modal-locked");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={`modal-overlay ${className} ${isOpen ? "_active" : ""}`}>
      <div className="modal-wrapper">
        <div className="modal-cross" onClick={onClose}>
          <Icon name="modal-cross" fill={"#6F767E"} />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
