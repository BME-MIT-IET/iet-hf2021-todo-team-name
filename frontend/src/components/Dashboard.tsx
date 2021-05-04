import React, { useEffect } from "react";
import WeekView from "./WeekView";
import { EuiTabbedContent } from "@elastic/eui";
import { Class } from "./Class";
import { Issues } from "./Issues";
import { useAppDispatch } from "../store";
import { getClasses } from "../store/classes";
import { getColumns } from "../store/columns";
import { getIssues } from "../store/issues";
import { User } from "./User";
import { Labels } from "./Labels";
import { getLabels } from "./../store/labels";
import { Search } from "./Search";
import { getWorkspaces } from "../store/workspaces";
import { getUsers } from "../store/users";

const tabs = [
  {
    id: "weekly",
    name: "Heti nézet",
    disabled: false,
    content: <WeekView />,
  },
  {
    id: "task",
    name: "Feladat nézet",
    disabled: false,
    content: <Issues />,
  },
  {
    id: "search",
    name: "Keresés",
    disabled: false,
    content: <Search />,
  },
  {
    id: "labels",
    name: "Címkék",
    disabled: false,
    content: <Labels />,
  },
  {
    id: "class",
    name: "Tárgy nézet",
    disabled: false,
    content: <Class />,
  },
  {
    id: "user",
    name: "Felhasználó",
    disabled: false,
    content: <User />,
  },
];

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getClasses());
    dispatch(getIssues());
    dispatch(getColumns());
    dispatch(getLabels());
    dispatch(getWorkspaces());
    dispatch(getUsers());
  }, []);

  return (
    <EuiTabbedContent
      tabs={tabs}
      initialSelectedTab={tabs[0]}
      autoFocus="selected"
    />
  );
};

export default Dashboard;
