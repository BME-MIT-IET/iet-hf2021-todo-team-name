import React, { useRef, useState } from "react";
import { useClasses } from "../contexts/ClassProvider";
import { Class } from "./../../types";
import { useAppDispatch } from "../../store/index";
import { removeClass, addClasses, editClass } from "../../store/classes";
import { v4 } from "uuid";
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
} from "@elastic/eui";
import { colors } from "../../types";

interface NewClassModalProps {
  closeModal: Function;
  edit: Class | undefined;
}

// const colors = [
//   { text: "Kék", value: "--blue" },
//   { text: "Indigó", value: "--indigo" },
//   { text: "Rózsaszín", value: "--pink" },
//   { text: "Piros", value: "--red" },
//   { text: "Narancssárga", value: "--orange" },
//   { text: "Zöld", value: "--yellow" },
//   { text: "Kékeszöld", value: "--cyan" },
//   { text: "Fehér", value: "--white" },
//   { text: "Szürke", value: "--gray" },
//   { text: "Sötét", value: "--dark-gray" },
// ];

export const NewClassModal: React.FC<NewClassModalProps> = ({
  closeModal,
  edit,
}) => {
  const [name, setName] = useState(edit?.name || "");
  const [color, setColor] = useState(edit?.color || colors.blue.value);
  const [icon, setIcon] = useState(edit?.icon || "");
  const dispatch = useAppDispatch();

  function handleSubmit(e: { preventDefault: Function }) {
    e.preventDefault();

    // const color =
    //   colors.find((item) => item.name === colorRef.current.value)?.code ||
    //   "--blue";

    if (typeof edit !== "undefined") {
      // classHook?.editClass({
      //   name,
      //   color,
      //   id: edit?.id,
      //   icon: iconRef.current.value,
      // });

      dispatch(
        editClass({
          name,
          color: color,
          id: edit.id,
          icon,
        })
      );
    } else {
      //classHook?.createClass(name, color, iconRef.current.value);
      dispatch(
        addClasses({
          id: v4(),
          name,
          color: color,
          icon,
        })
      );
    }

    //createContact(idRef.current.value, nameRef.current.value);
    closeModal();
  }

  function handleDelete() {
    //classHook?.deleteClass(edit?.id);
    dispatch(removeClass(edit?.id));
    closeModal();
  }

  return (
    <>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          {edit ? "Tárgy szerkesztése" : "Új tárgy"}
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm>
          <EuiFormRow label="Név">
            <EuiFieldText
              name="name"
              value={name as string}
              onChange={(e) => setName(e.target.value)}
            />
          </EuiFormRow>
          <EuiFormRow label="Szín">
            <EuiSelect
              id="color"
              options={Object.values(colors)}
              value={color as string}
              onChange={(e) => setColor(e.target.value)}
            />
          </EuiFormRow>

          <EuiFormRow label="Ikon">
            <EuiFieldText
              name="icon"
              value={icon as string}
              onChange={(e) => setIcon(e.target.value)}
            />
          </EuiFormRow>
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
