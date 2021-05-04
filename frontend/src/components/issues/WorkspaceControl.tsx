import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiSelect,
  EuiButton,
  EuiOverlayMask,
  EuiModal,
  EuiComboBox,
} from "@elastic/eui";
import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store";
import { changeWorkspaceUsers } from "../../store/workspaces";
import { NewWorkspaceModal } from "../Modals/NewWorkspaceModal";
import { useAppDispatch } from "./../../store/index";

interface WorkspaceControlProps {
  selected: string;
  onChange: (newWorkspace: string) => void;
}

export const WorkspaceControl: React.FC<WorkspaceControlProps> = ({
  selected,
  onChange,
}) => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { workspaces, auth } = useAppSelector((state) => state);

  // const workspace = useMemo(() => {
  //   console.log("change selected");
  //   return (
  //     workspaces.find((item) => item.id === selected) || {
  //       id: "",
  //       name: "",
  //       users: [],
  //       columns: [],
  //     }
  //   );
  // }, [selected, workspaces]);
  const workspace = workspaces.find((item) => item.id === selected) || {
    id: "",
    name: "",
    users: [],
    columns: [],
  };

  const workspaceOptions = useMemo(() => {
    const options = workspaces.map((item) => ({
      value: item.id,
      text: item.name,
    }));
    return options;
  }, [workspaces]);

  const userOptions = useMemo(() => {
    return auth.otherUsers.map((item) => ({ label: item.name as string }));
  }, [auth.otherUsers]);

  const selectedUserOptions = useMemo(() => {
    console.log(workspace.users);
    return workspace?.users
      .filter((item) => item.id !== auth.user?.id)
      .map((item) => ({ label: item.name as string }));
  }, [workspace.users.length]);

  const onUserOptionChange = (selectedOptions: { label: string }[]) => {
    const userIDs: string[] = [];
    if (auth.user?.id) userIDs.push(auth.user?.id as string);

    selectedOptions.forEach((item) => {
      const id = auth.otherUsers.find((user) => user.name === item.label)
        ?.id as string;
      if (id) userIDs.push(id);
    });

    dispatch(changeWorkspaceUsers({ id: workspace?.id, userIDs }));
  };

  useEffect(() => {
    onChange(workspaceOptions[0]?.value || "Nincs még munkaterületed");
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <>
      <EuiFlexGroup
        direction="row"
        style={{ width: "100%", paddingLeft: "20px" }}
        component="span"
      >
        <EuiFlexItem>
          <EuiSelect
            id="selectWorkspace"
            options={workspaceOptions}
            value={selected}
            onChange={(e) => onChange(e.currentTarget.value)}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton color="secondary" onClick={openModal}>
            Új munkaterület
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiComboBox
            placeholder="Hívj meg másokat is"
            options={userOptions}
            selectedOptions={selectedUserOptions}
            onChange={onUserOptionChange}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      {modalOpen && (
        <EuiOverlayMask>
          <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
            <NewWorkspaceModal closeModal={closeModal} />
          </EuiModal>
        </EuiOverlayMask>
      )}
    </>
  );
};
