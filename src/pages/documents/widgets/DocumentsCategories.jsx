import React from "react";
import SwiperElement from "../../../widgets/common/ui/SwiperElement";

const DocumentsCategories = ({
  availableDocTypes,
  selectedDocType,
  setSelectedDocType,
}) => {
  const handleClick = (e) => {
    setSelectedDocType(e.key);
    // fetchTasks();
  };
  return (
    <SwiperElement
      onClick={handleClick}
      items={availableDocTypes}
      selectedItem={selectedDocType}
    />
  );
};

export default DocumentsCategories;
