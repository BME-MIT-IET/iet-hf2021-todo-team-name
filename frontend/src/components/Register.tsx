import {
  EuiButton,
  EuiFieldText,
  EuiFieldPassword,
  EuiForm,
  EuiFormRow,
  EuiPage,
  EuiText,
} from "@elastic/eui";
import React from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "./../store/index";
import { useForm } from "react-hook-form";
import styles from "../styles/login.module.css";
import { register as registerUser } from "../store/users";

interface RegisterProps {}

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

export const Register: React.FC<RegisterProps> = () => {
  const { errors, register, handleSubmit } = useForm<IFormInput>();
  const dispatch = useAppDispatch();
  const history = useHistory();

  async function onSubmit(data: IFormInput) {
    const res = await dispatch(
      registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    );
    if (res.payload) {
      history.push("/");
    }
  }
  return (
    <EuiPage>
      <EuiForm
        className={styles.form}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <EuiFormRow>
          <EuiText>
            <h1>Regisztráció</h1>
          </EuiText>
        </EuiFormRow>

        <EuiFormRow
          label="Teljes név"
          isInvalid={!!errors.name}
          error={errors.name?.type}
        >
          <EuiFieldText
            name="name"
            inputRef={register({ required: true, maxLength: 100 })}
            isInvalid={!!errors.name}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Email cím"
          isInvalid={!!errors.email}
          error={errors.email?.type}
        >
          <EuiFieldText
            name="email"
            inputRef={register({
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              required: true,
            })}
            isInvalid={!!errors.email}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Jelszó"
          isInvalid={!!errors.password}
          error={errors.password?.type}
        >
          <EuiFieldPassword
            name="password"
            inputRef={register({ minLength: 5, maxLength: 32, required: true })}
            isInvalid={!!errors.password}
          />
        </EuiFormRow>

        <EuiButton color="secondary" type="submit">
          Regisztráció
        </EuiButton>
      </EuiForm>
    </EuiPage>
  );
};
