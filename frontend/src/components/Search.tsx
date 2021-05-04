import {
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiOverlayMask,
  EuiPage,
  EuiText,
} from "@elastic/eui";
import React from "react";
import { useState } from "react";
import { searchIssue } from "../store/searchIssue";
import { useAppDispatch, useAppSelector } from "./../store/index";
import { IssueCard } from "./issues/IssueCard";
import { NewIssueModal } from "./Modals/NewIssueModal";
import issueAPI from "../api/issue";

interface SearchProps {}

export const Search: React.FC<SearchProps> = ({}) => {
  const { searchIssues } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  function modalClose() {
    setModalOpen(!modalOpen);
  }
  function openModal() {
    setModalOpen(!modalOpen);
  }

  //   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearch(e.currentTarget.value);
  //     dispatch(searchIssue(search));
  //   };
  const onSearchChange = (value: string) => {
    issueAPI.cancelTokenSource.cancel();
    setSearch(value);
    dispatch(searchIssue(value));
  };

  return (
    <EuiPage restrictWidth={true}>
      <EuiFlexGroup direction="column" justifyContent="center">
        <EuiFlexItem>
          <EuiFieldSearch
            placeholder="Feladatok keresése"
            // value={search}
            // onChange={(e) => onSearchChange(e)}
            onSearch={(value) => onSearchChange(value)}
            incremental={true}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          {searchIssues.length === 0 && (
            <EuiText>Itt fognak megjelenni a keresett feladatok</EuiText>
          )}
          <EuiFlexGroup
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            wrap
          >
            {searchIssues.map((item, index) => (
              <EuiFlexItem key={index}>
                <IssueCard issue={item} openModal={openModal} />
                {modalOpen && (
                  <EuiOverlayMask>
                    <EuiModal
                      onClose={modalClose}
                      initialFocus="[name=popswitch]"
                    >
                      <NewIssueModal closeModal={modalClose} edit={item} />
                    </EuiModal>
                  </EuiOverlayMask>
                )}
              </EuiFlexItem>
            ))}
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPage>
  );
};
