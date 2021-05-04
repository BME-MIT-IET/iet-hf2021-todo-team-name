import React, { ReactNode, useState } from "react";
import { Issue } from "../../api/issue";
import {
  EuiBadge,
  EuiCard,
  EuiFlexItem,
  EuiIcon,
  EuiModal,
  EuiOverlayMask,
  EuiSpacer,
} from "@elastic/eui";
import { useDrag } from "react-dnd";

import { NewIssueModal } from "../Modals/NewIssueModal";
import { Column } from "../../api/column";
import moment from "moment";
import { IssueCard } from "./IssueCard";

interface IssueComponentProps {
  issue: Issue;
  columnId: String;
  column: Column;
}

export const IssueComponent: React.FC<IssueComponentProps> = ({
  issue,
  columnId,
  column,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  function modalClose() {
    setModalOpen(!modalOpen);
  }
  function openModal() {
    setModalOpen(!modalOpen);
  }

  const [_, drag] = useDrag({
    item: { name: issue.id, type: "issue", originColumnId: columnId },
    collect: (monitor) => ({ opacity: monitor.isDragging() ? 0.4 : 1 }),
  });

  return (
    <EuiFlexItem>
      <div ref={drag}>
        <IssueCard issue={issue} openModal={openModal} />
      </div>
      {modalOpen && (
        <EuiOverlayMask>
          <EuiModal onClose={modalClose} initialFocus="[name=popswitch]">
            <NewIssueModal
              closeModal={modalClose}
              edit={issue}
              column={column}
            />
          </EuiModal>
        </EuiOverlayMask>
      )}
    </EuiFlexItem>
  );
};
