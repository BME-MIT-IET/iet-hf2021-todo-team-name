import {
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
} from "@elastic/eui";
import * as momentJS from "moment";
import React from "react";
import { editClass } from "../../store/classes";
import { NewClassModal } from "../Modals/NewClassModal";
import { NewIssueModal } from "../Modals/NewIssueModal";

interface ModalProps {
  start: moment.Moment;
  end: moment.Moment;
  value: string;
  onRemove: () => void;
  onSave({ value }: { value: string }): void;
  actionType: string;
}

function getTimeString(hours: Number) {
  if (hours < 10) return `0${hours}:00`;
  if (hours < 100) return `${hours}:00`;
  return `99:00`;
}

export const Modal: React.FC<ModalProps> = ({
  start,
  end,
  value,
  onRemove,
  onSave,
  actionType,
}) => {
  const duration = momentJS.duration(end.diff(start)).asHours();
  console.log(duration);
  return (
    <EuiModal onClose={() => {}}>
      <NewIssueModal
        closeModal={() => onSave({ value: "" })}
        edit={undefined}
        event={{ start, end, length: getTimeString(duration) }}
      />
    </EuiModal>
  );
};
