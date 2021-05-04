import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import React from "react";
import { useAppSelector } from "../store";
import { useAppDispatch } from "../store";
import { logout } from "../store/users";
import { useHistory } from "react-router-dom";

interface UserProps {}

export const User: React.FC<UserProps> = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state);
  const history = useHistory();
  const user = auth.user;

  function handleLogout() {
    dispatch(logout());
    history.push("/login");
  }

  return (
    <EuiPage restrictWidth={true}>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiTitle size="l">
            <h1>
              <b>{user?.name}</b>
            </h1>
          </EuiTitle>
          <EuiText>
            <p>{user?.email}</p>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton color="danger" onClick={handleLogout}>
            Kijelentkezés
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />
    </EuiPage>
  );
};
