import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Issue } from "./../../api/issue";
import { Column as ColumnType } from "./../../api/column";
import styles from "../../styles/issues.module.css";
import {
  EuiFlexGroup,
  EuiIcon,
  EuiSpacer,
  EuiOverlayMask,
  EuiModal,
} from "@elastic/eui";
import { IssueComponent } from "./IssueComponent";
import { NewIssueModal } from "../Modals/NewIssueModal";

interface columnProps {
  children?: any;
  issue?: Issue;
  column: ColumnType;
  onDrop: (item: any) => void;
}

export const Column: React.FC<columnProps> = ({
  children,
  issue,
  column,
  onDrop,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  function modalClose() {
    setModalOpen(!modalOpen);
  }
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "issue",
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),

    // drop: () => moveIssue(issue, column),
  });
  const active = isOver && canDrop;
  return (
    <div ref={drop}>
      <div className={styles.column}>
        <div className={styles.columnTop}>{column.name}</div>
        <div className={styles.columnBody}>
          {column.issues.map((issue, index) => (
            <EuiFlexGroup key={index}>
              <IssueComponent
                issue={issue}
                columnId={column.id}
                column={column}
              />
            </EuiFlexGroup>
          ))}
        </div>
        {active && <EuiSpacer size="xxl" />}
        <div className={styles.add} onClick={() => setModalOpen(true)}>
          <EuiIcon type="bullseye" /> Új feladat
        </div>
      </div>
      {modalOpen && (
        <EuiOverlayMask onClick={modalClose}>
          <EuiModal onClose={modalClose} initialFocus="[name=popswitch]">
            <NewIssueModal
              closeModal={modalClose}
              edit={undefined}
              column={column}
            />
          </EuiModal>
        </EuiOverlayMask>
      )}
    </div>
  );
};
