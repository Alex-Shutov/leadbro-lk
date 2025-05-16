import { useState, useEffect, useRef } from "react";

export const useHeaderLogic = () => {
  const [activeItem, setActiveItem] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveItem(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleItem = (itemName, e) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  return { activeItem, toggleItem, headerRef };
};
