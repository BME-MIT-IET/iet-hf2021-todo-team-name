import React from "react";
import moment from "moment";

interface DayCellProps {
  startSelection: Function;
  startTime: String;
}

export const DayCell: React.FC<DayCellProps> = ({
  startSelection,
  startTime,
}) => {
  function handleMouseDown(e: { button: Number }) {
    if (e.button === 0) {
      startSelection();
    }
  }
  const now = moment();
  const start = moment(startTime);
  const active = now.hours() === start.hours() && now.days() === start.days();
  const style = active
    ? {
        background: "red",
      }
    : {};

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`dayCell ${active ? "active" : ""}`}
      role="presentation"
      style={style}
    >
      &nbsp;
    </div>
  );
};
