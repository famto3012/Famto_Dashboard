import { useState } from "react";

export const useDraggable = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    document.body.classList.add("no-select");
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    document.body.classList.remove("no-select");
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.classList.remove("no-select");
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 1;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  return {
    isDragging,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  };
};
