import React, { useState, useEffect } from "react";
import { NewClassModal } from "./Modals/NewClassModal";
import { Class as ClassType } from "../types";
import { useAppSelector, useAppDispatch } from "../store/index";
import { getClasses } from "../store/classes";
import {
  EuiTitle,
  EuiButton,
  EuiSpacer,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiOverlayMask,
  EuiModal,
} from "@elastic/eui";

interface ClassProps {}

export const Class: React.FC<ClassProps> = () => {
  const [newModalOpen, setNewModalOpen] = useState<Boolean>(false);
  const [editClass, setEditClass] = useState<ClassType | undefined>(undefined);
  const { classes } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getClasses());
  }, []);

  function newModalClose() {
    setNewModalOpen(false);
  }

  return (
    <EuiPage restrictWidth={true}>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <EuiTitle size="l">
          <h1>
            <b>Tárgyak</b>
          </h1>
        </EuiTitle>
        <EuiSpacer />
        <EuiButton
          color="secondary"
          onClick={() => {
            setEditClass(undefined);
            setNewModalOpen(true);
          }}
        >
          Tárgy hozzáadása
        </EuiButton>
        <EuiSpacer />
        <EuiFlexGroup gutterSize="l" wrap>
          {classes.map((item, index) => {
            return (
              <EuiFlexItem key={index} style={{ color: `${item.color}` }}>
                <EuiCard
                  layout="horizontal"
                  title={
                    <span style={{ color: `${item.color}` }}>{item.name}</span>
                  }
                  description={item.id}
                  onClick={() => {
                    setEditClass(item);
                    setNewModalOpen(true);
                  }}
                />
              </EuiFlexItem>
            );
          })}
        </EuiFlexGroup>
        {newModalOpen && (
          <EuiOverlayMask>
            <EuiModal onClose={newModalClose} initialFocus="[name=popswitch]">
              <NewClassModal closeModal={newModalClose} edit={editClass} />
            </EuiModal>
          </EuiOverlayMask>
        )}
      </div>
    </EuiPage>
  );
};
