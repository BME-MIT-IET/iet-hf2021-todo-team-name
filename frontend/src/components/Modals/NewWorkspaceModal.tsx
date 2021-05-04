import {
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiForm,
  EuiFieldText,
  EuiFormRow,
  EuiModalFooter,
  EuiButton,
} from "@elastic/eui";
import React from "react";
import { useState } from "react";
import { useAppDispatch } from "./../../store/index";
import { createWorkspace } from "./../../store/workspaces";

interface NewWorkspaceModalProps {
  closeModal: () => void;
}

export const NewWorkspaceModal: React.FC<NewWorkspaceModalProps> = ({
  closeModal,
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.length > 0) {
      dispatch(createWorkspace(name));
      closeModal();
    }
  };

  return (
    <>
      <EuiModalHeader>
        <EuiModalHeaderTitle>Új munkaterület</EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm>
          <EuiFormRow label="Név">
            <EuiFieldText
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButton color="secondary" onClick={handleSubmit}>
          Létrehozás
        </EuiButton>
      </EuiModalFooter>
    </>
  );
};
