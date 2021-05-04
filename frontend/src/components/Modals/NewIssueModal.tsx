import React, { useState, useEffect } from "react";
import { Issue } from "./../../api/issue";
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSelect,
  EuiDatePicker,
  EuiRadioGroup,
  EuiSwitch,
  EuiSpacer,
  EuiComboBox,
} from "@elastic/eui";
import { useAppDispatch, useAppSelector } from "../../store";
import { getClasses } from "../../store/classes";
import * as moment from "moment";
import { v4 } from "uuid";
import { addIssue, editIssue, removeIssue } from "../../store/issues";
import { removeIssue as removeIssueFromColumn } from "../../store/columns";
import { addIssue as addIssueToColumn } from "../../store/columns";
import { Column } from "./../../api/column";
import labelAPI, { Label } from "../../api/label";

interface NewIssueModalProps {
  closeModal: () => void;
  edit: Issue | undefined;
  column?: Column;
  event?: { start: any; length: string; end: any };
}

interface ILabelOptions {
  label: string;
  color: string;
}

let options: { text: string; value: string }[] = [];
const radios = [
  {
    id: "radio-event",
    label: "Esemény",
  },
  {
    id: "radio-issue",
    label: "Feladat",
  },
];
export const NewIssueModal: React.FC<NewIssueModalProps> = ({
  closeModal,
  edit,
  column,
  event,
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getClasses());
  }, []);
  const { classes, issues, labels } = useAppSelector((state) => state);
  edit = issues.find((item: Issue) => item.id === edit?.id);
  useEffect(() => {
    options = [{ text: "Egyik sem", value: "" }];
    classes.forEach((item) => {
      options.push({
        text: item.name as string,
        value: item.id as string,
      });
    });
  }, [classes]);
  const [labelOptions, setLabelOptions] = useState<ILabelOptions[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<{ label: string }[]>(
    edit?.labels?.map((label) => ({ label: label.name })) || []
  );
  useEffect(() => {
    let arr: ILabelOptions[] = [];
    labels.forEach((item) => {
      arr.push({
        label: item.name,
        color:
          labelAPI.colors.find((color) => color.value === item.type)?.color ||
          "hollow",
      });
    });
    setLabelOptions(arr);
  }, [labels]);

  const onLabelOptionsChange = (selected: { label: string }[]) => {
    setSelectedLabels(selected);
  };

  const [title, setTitle] = useState(edit?.title || "");
  const [titleInvalid, setTitleInvalid] = useState(true);
  const [body, setBody] = useState(edit?.body || "");
  const [classId, setClassId] = useState(edit?.relevantClass?.id || "");
  const [type, setType] = useState(event ? "radio-event" : "radio-issue");
  const [date, setDate] = useState(event?.start || moment());
  const [endDate, setEndDate] = useState(event?.end || moment());
  const [hasDeadline, setHasDeadline] = useState(
    typeof edit?.date === "string"
  );
  const [deadline, setDeadline] = useState(moment());
  const [timespan, setTimespan] = useState(
    edit?.deadline || event?.length || "00:00"
  );

  useEffect(() => {
    return setTitleInvalid(false);
    // disabled for now
    /*if (title === edit?.title) return setTitleInvalid(false);
    const index = issues.findIndex(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    );
    setTitleInvalid(index !== -1);*/
  }, [title]);

  function onTimeSpanChange(time: string) {
    if (time.length < timespan.length) return setTimespan(time);
    switch (time.length) {
      case 0:
        return;
      case 1:
        if (Number(time[0]) < 0 || Number(time[0]) > 2) return;
        break;
      case 2:
        if (Number(time[0]) < 0 || Number(time[0]) > 2) return;
        if (!/\d/.test(time[1])) return;
        break;
      case 3:
        if (Number(time[0]) < 0 || Number(time[0]) > 2) return;
        if (!/\d/.test(time[1])) return;
        if (time[2] !== ":") return;
        break;
      case 4:
        if (Number(time[0]) < 0 || Number(time[0]) > 2) return;
        if (!/\d/.test(time[1])) return;
        if (time[2] !== ":") return;
        if (Number(time[3]) < 0 || Number(time[3]) > 5) return;
        break;
      case 5:
        if (Number(time[0]) < 0 || Number(time[0]) > 2) return;
        if (!/\d/.test(time[1])) return;
        if (time[2] !== ":") return;
        if (Number(time[3]) < 0 || Number(time[3]) > 5) return;
        if (!/\d/.test(time[4])) return;
        break;
      default:
        return;
    }
    setTimespan(time);
  }

  async function handleSubmit() {
    if (titleInvalid) return;
    let classObject = null;
    if (classId.length > 0) {
      classObject = classes.find((item) => item.id === classId) || null;
    }

    const issue: Issue = {
      id: edit ? edit.id : v4(),
      title,
      body,
      type: type === "radio-event" ? "event" : "issue",
      relevantClass: classObject,
    };
    if (type === "radio-issue" && hasDeadline) {
      issue.deadline = deadline.toDate();
    } else if (type === "radio-event") {
      issue.date = date.toDate();
      issue.timespan = timespan;
      issue.start = date.toDate();
      issue.end = endDate.toDate();
    }
    let arr: Label[] = [];
    selectedLabels.forEach((selected) => {
      const label = labels.find((item) => item.name === selected.label);
      if (label) {
        arr.push(label);
      }
    });
    issue.labels = arr;

    //if (column) dispatch(createAndAdd({ id: column.id, newIssue: issue }));
    const { payload }: { payload: any } = await dispatch(
      edit ? editIssue(issue) : addIssue(issue)
    );
    if (column && !edit)
      await dispatch(addIssueToColumn({ id: column.id, issueid: payload.id }));
    // if (column) dispatch(addIssueToColumn({ id: column.id, newIssue: issue }));
    // else dispatch(addIssueToFirstColumn(issue));
    closeModal();
  }

  async function handleDelete() {
    if (edit && column) {
      await dispatch(removeIssue(edit?.id));
      dispatch(removeIssueFromColumn({ id: column.id, issueId: edit.id }));
    }
    closeModal();
  }
  return (
    <>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          {edit ? "Feladat szerkesztése" : "Új feladat"}
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm>
          <EuiFormRow
            label="Cím"
            isInvalid={titleInvalid}
            error="Ilyen című feladat már létezik"
          >
            <EuiFieldText
              name="title"
              value={title as string}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={titleInvalid}
            />
          </EuiFormRow>
          <EuiFormRow label="Leírás">
            <EuiFieldText
              name="body"
              value={body as string}
              onChange={(e) => setBody(e.target.value)}
            />
          </EuiFormRow>
          <EuiFormRow label="Kapcsolódó tárgy">
            <EuiSelect
              id="class"
              options={options}
              value={classId as string}
              onChange={(e) => setClassId(e.target.value)}
            />
          </EuiFormRow>
          <EuiFormRow label="Címkék">
            <EuiComboBox
              placeholder="Válassz egy vagy több címkét"
              options={labelOptions}
              selectedOptions={selectedLabels}
              onChange={onLabelOptionsChange}
              isClearable={true}
            />
          </EuiFormRow>
          <EuiFormRow label="Típus">
            <EuiRadioGroup
              options={radios}
              idSelected={type}
              onChange={(id) => setType(id)}
            />
          </EuiFormRow>
          {type === "radio-event" ? (
            <>
              <EuiFormRow label="Esemény kezdete">
                <EuiDatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  showTimeSelect
                  locale="hu"
                  dateFormat="YYYY.MM.DD. HH:mm"
                  timeFormat="HH:mm"
                />
              </EuiFormRow>
              <EuiFormRow label="Esemény vége">
                <EuiDatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  locale="hu"
                  dateFormat="YYYY.MM.DD. HH:mm"
                  timeFormat="HH:mm"
                />
              </EuiFormRow>
              <EuiFormRow label="Időtartam">
                <EuiFieldText
                  name="timespan"
                  value={timespan as string}
                  onChange={(e) => onTimeSpanChange(e.target.value)}
                />
              </EuiFormRow>
            </>
          ) : (
            <>
              <EuiSpacer />
              <EuiSwitch
                label="Határidő"
                checked={hasDeadline}
                onChange={(e) => setHasDeadline(e.target.checked)}
              />

              <EuiSpacer />
              {hasDeadline && (
                <EuiFormRow label="Határidő">
                  <EuiDatePicker
                    selected={deadline}
                    onChange={(date) => setDeadline(date)}
                    showTimeSelect
                    locale="hu"
                    dateFormat="YYYY.MM.DD. HH:mm"
                    timeFormat="HH:mm"
                  />
                </EuiFormRow>
              )}
            </>
          )}
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        {edit && (
          <EuiButtonEmpty color="danger" onClick={handleDelete}>
            Törlés
          </EuiButtonEmpty>
        )}
        <EuiButton color="secondary" onClick={handleSubmit}>
          {edit ? "Szerkesztés" : "Létrehozás"}
        </EuiButton>
      </EuiModalFooter>
    </>
  );
};
