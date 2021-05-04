import React, { useEffect, useMemo, useState } from "react";
import WeekCalendar from "react-week-calendar";
import "react-week-calendar/dist/style.css";
import * as moment from "moment";
import { Event as CustomEvent } from "./CustomCalendarComponents/Event";
import { DayCell } from "./CustomCalendarComponents/DayCell";
import { HeaderCell } from "./CustomCalendarComponents/HeaderCell";
import { Modal } from "./CustomCalendarComponents/Modal";
import { useAppSelector, useAppDispatch } from "../store";
import { getColumns } from "../store/columns";
import { getIssues } from "../store/issues";
import { Issue } from "./../api/issue";

type Event = {
  uid: Number;
  value: String;
  start: String;
  end: String;
};

export default function WeekView() {
  const { issues } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const [notselectedIntervals, setSelectedIntervals] = useState<Issue[]>([]);

  /*useEffect(() => {
    console.log(issues)
    let arr: Issue[] = [];
      issues.forEach(issue => {
        if (issue.type === "event") arr.push(issue);
      });
      console.log(arr)
      //setSelectedIntervals(arr);
  }, [issues]);*/

  const selectedIntervals = useMemo(() => {
    let arr: Issue[] = [];
    issues.forEach((issue) => {
      if (issue.type === "event") {
        // issue.start = moment(issue.start);
        // issue.end = moment(issue.end);
        arr.push({
          ...issue,
          start: moment(issue.start),
          end: moment(issue.end),
        });
      } else if (issue.deadline) {
        const start = moment(issue.deadline);
        arr.push({
          ...issue,
          start,
          end: moment(issue.deadline).add(moment.duration("02:00")),
        });
      }
    });
    return arr;
  }, [JSON.stringify(issues)]);

  // useMemo(() => {
  //   console.log(issues);
  //   let arr: Issue[] = [];
  //   issues.forEach((issue) => {
  //     if (issue.type === "event") arr.push(issue);
  //   });
  //   console.log(arr);
  //   //setSelectedIntervals(arr);
  // }, [issues]);

  const [lastId, setLastId] = useState(0);

  function handleEventRemove(event: Issue) {
    const index = selectedIntervals.findIndex(
      (interval: Issue) => interval.id === event.id
    );
    if (index > -1) {
      let arr = selectedIntervals;
      arr.splice(index, 1);
      setSelectedIntervals(arr);
    }
  }

  function handleEventUpdate(event: Issue) {
    const index = selectedIntervals.findIndex(
      (interval: Issue) => interval.id === event.id
    );
    if (index > -1) {
      let arr = selectedIntervals;
      arr[index] = event;
      setSelectedIntervals(arr);
    }
  }

  function handleSelect(newIntervals: [Issue]) {
    const intervals = newIntervals.map((interval, index) => {
      return {
        ...interval,
        uid: lastId + index,
      };
    });
    setSelectedIntervals(selectedIntervals.concat(intervals));
    setLastId(lastId + intervals.length);
  }
  let now = moment();
  if (now.day() === 0) now.day(-6);
  else now.day(1);

  return (
    <WeekCalendar
      scaleUnit={60}
      startTime={moment({ h: 8, m: 0 })}
      endTime={moment({ h: 21, m: 0 })}
      selectedIntervals={selectedIntervals}
      onIntervalSelect={handleSelect}
      onIntervalUpdate={handleEventUpdate}
      onIntervalRemove={handleEventRemove}
      eventComponent={CustomEvent}
      cellHeight={40}
      firstDay={now}
      dayFormat={"MM.DD"}
      dayCellComponent={DayCell}
      headerCellComponent={HeaderCell}
      modalComponent={Modal}
    />
  );
}
