import React from "react";
import { Select } from "../../../shared/ui/select";

export const SearchEngineSelector = ({
                                       searchers,
                                       selectedSearcher,
                                       onSearcherChange,
                                       isLoading = false
                                     }) => {

  // Format options for the select
  const options = React.useMemo(() =>
          searchers?.map(searcher => ({
            value: searcher.id,
            label: searcher.name
          })) || [],
      [searchers]
  );

  // Get currently selected option value
  const selectedValue = selectedSearcher?.id || "";

  // Handle selection change
  const handleChange = (value) => {
    // Find the selected searcher object from the value
    const selected = searchers.find(s => s.id === value);
    if (selected) {
      onSearcherChange(selected);
    }
  };

  return (
      <div className="selector-container">
        <span className="selector-label">Поисковая система:</span>
        <Select
            options={options}
            value={selectedValue}
            onChange={handleChange}
            placeholder="Выберите поисковую систему"
        />
      </div>
  );
};
