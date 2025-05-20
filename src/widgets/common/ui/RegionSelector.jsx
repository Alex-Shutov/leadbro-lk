import React from "react";
import { Select } from "../../../shared/ui/select";

export const RegionSelector = ({
                                 regions,
                                 selectedRegion,
                                 onRegionChange,
                                 isLoading = false
                               }) => {
  // Format options for the select
  const options = React.useMemo(() =>
          regions?.map(region => ({
            value: region.id,
            label: region.name
          })) || [],
      [regions]
  );

  // Get currently selected option value
  const selectedValue = selectedRegion?.id || "";

  // Handle selection change
  const handleChange = (value) => {
    // Find the selected region object from the value
    const selected = regions.find(r => r.id === value);
    if (selected) {
      onRegionChange(selected);
    }
  };

  return (
      <div className="selector-container">
        <span className="selector-label">Регион:</span>
        <Select
            options={options}
            value={selectedValue}
            onChange={handleChange}
            placeholder="Выберите регион"
        />
      </div>
  );
};