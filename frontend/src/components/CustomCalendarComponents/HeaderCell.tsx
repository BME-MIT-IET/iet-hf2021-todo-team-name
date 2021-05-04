import React from "react";

interface HeaderCellProps {
  date: moment.Moment;
  dayFormat: string;
}

const namesOfDays: string[] = [
  "Vasárnap",
  "Hétfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
];

function dayToHungarian(index: Number) {
  if (index > -1 && index < 7)
    return namesOfDays.find((item, i) => i === index);
  return "";
}

export const HeaderCell: React.FC<HeaderCellProps> = ({ date, dayFormat }) => {
  return (
    <span className="title">
      {dayToHungarian(date.day()) + ", " + date.locale("hu").format(dayFormat)}
    </span>
  );
};
