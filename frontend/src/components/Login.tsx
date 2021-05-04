import {
  EuiButton,
  EuiFieldText,
  EuiFieldPassword,
  EuiForm,
  EuiFormRow,
  EuiPage,
  EuiText,
  EuiLink,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from "@elastic/eui";
import React, { FormEvent, useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "./../store/index";
import { logIn, setToken } from "./../store/users";
import styles from "../styles/login.module.css";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken({ token }));
      history.push("/");
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await dispatch(logIn({ email, password }));
    if (res.payload) {
      history.push("/");
    } else {
      setShowErrors(true);
    }
  }

  const handleRegisterLink = () => {
    history.push("/register");
  };

  let errors: String[] = [];
  if (showErrors) {
    errors = ["A szerver nem elérhető"];
  }

  return (
    <EuiPage>
      <EuiForm
        className={styles.form}
        component="form"
        isInvalid={showErrors}
        error={errors}
      >
        <EuiFormRow>
          <EuiText>
            <h1>Bejelentkezés</h1>
          </EuiText>
        </EuiFormRow>
        <EuiFormRow label="Email cím">
          <EuiFieldText
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </EuiFormRow>
        <EuiFormRow label="Jelszó">
          <EuiFieldPassword
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFlexGroup
          direction="row"
          alignItems="center"
          justifyContent="spaceAround"
        >
          <EuiFlexItem>
            <EuiButton color="secondary" onClick={handleSubmit} type="submit">
              Bejelentkezés
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiLink onClick={handleRegisterLink}>Nincs még fiókod?</EuiLink>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiForm>
    </EuiPage>
  );
};
