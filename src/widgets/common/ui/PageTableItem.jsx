import React from "react";

const PageTableItem = ({ columnClassName, itemClassName, items = [] }) => {
  return (
    <div className={itemClassName}>
      {items.map(
        (el) =>
          el && (
            <div className={`${columnClassName} ${el?.className}`}>
              <span>{el.label}</span>
              <p>{el.value}</p>
            </div>
          ),
      )}
    </div>
  );
};

export default PageTableItem;
