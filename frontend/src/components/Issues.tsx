import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiHeader,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSelect,
  EuiSpacer,
} from "@elastic/eui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAppSelector, useAppDispatch } from "../store";
import { getColumns, moveIssue } from "./../store/columns";
import { Column } from "./issues/column";
import { getIssues } from "./../store/issues";
import { NewWorkspaceModal } from "./Modals/NewWorkspaceModal";
import { WorkspaceControl } from "./issues/WorkspaceControl";

export const Issues: React.FC = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState("");

  const handleSelectedWorkspaceChange = (newWorkspace: string) => {
    setSelectedWorkspace(newWorkspace);
  };

  const { issues, columns, workspaces } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getIssues());
    dispatch(getColumns());
  }, []);
  const handleDrop = useCallback(
    (
      id: String,
      item: { name: String; type: String; originColumnId: String }
    ) => {
      console.log(item.originColumnId);
      const issue = issues.find((issue) => issue.id === item.name);
      if (typeof issue === "undefined") return;
      console.log("defined");
      dispatch(
        moveIssue({
          origin: item.originColumnId,
          destination: id,
          newIssue: issue,
        })
      );
      // dispatch(removeIssue({ id: item.originColumnId, issueId: issue.id }));
      // dispatch(addIssue({ id, newIssue: issue }));
    },
    [issues, columns]
  );

  const workspace = useMemo(() => {
    return workspaces.find((item) => item.id === selectedWorkspace);
  }, [selectedWorkspace]);

  return (
    <>
      <EuiSpacer />
      <WorkspaceControl
        selected={selectedWorkspace}
        onChange={handleSelectedWorkspaceChange}
      />
      <DndProvider backend={HTML5Backend}>
        <EuiSpacer />
        <EuiFlexGroup
          style={{ width: "100%", paddingLeft: "1rem" }}
          justifyContent="flexEnd"
        >
          {workspace?.columns.map((column, index) => {
            return (
              <EuiFlexItem key={index}>
                <Column
                  column={column}
                  onDrop={(item: {
                    name: String;
                    type: String;
                    originColumnId: String;
                  }) => {
                    handleDrop(column.id, item);
                  }}
                ></Column>
              </EuiFlexItem>
            );
          })}
        </EuiFlexGroup>
      </DndProvider>
    </>
  );
};
