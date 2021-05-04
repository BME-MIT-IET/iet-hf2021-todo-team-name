import React from "react";
import styles from "../../styles/customevent.module.css";
import * as momentJS from "moment";
import { EuiCard } from "@elastic/eui";

interface EventProps {
  value: String;
  start: moment.Moment;
  timespan: string;
  title: string;
  end: moment.Moment;
  type: string;
}

function getHourAndMinute(time: moment.Moment): String {
  return `${formattedTime(time.hours())}:${formattedTime(time.minutes())}`;
}

function formattedTime(time: Number) {
  return time < 10 ? "0" + time : time;
}

function getTime(start: moment.Moment, timespan: string) {
  start.add(momentJS.duration(timespan));
  return start;
}

export const Event: React.FC<EventProps> = ({
  value,
  start,
  end,
  timespan,
  title,
  type,
}) => {
  const description =
    type == "event"
      ? `${getHourAndMinute(start)} - ${getHourAndMinute(end)}`
      : `Határidő: ${getHourAndMinute(start)}`;
  return (
    <EuiCard
      layout="vertical"
      title={title}
      titleSize="xs"
      className={styles.card + " event-card"}
      description={description}
      onClick={() => {}}
    />
  );

  return (
    <div
      className={`bg-primary h-100 text-white d-flex flex-column justify-content-center align-items-center ${styles.container}`}
    >
      <p className="font-weight-bold">
        {`${getHourAndMinute(start)} - ${getHourAndMinute(
          getTime(start, timespan)
        )}`}
      </p>
      {value}
    </div>
  );
};
