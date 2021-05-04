import {
  EuiBadge,
  EuiButton,
  EuiCard,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiPage,
  EuiSearchBar,
  EuiSelect,
  EuiSpacer,
  EuiTitle,
} from "@elastic/eui";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { useForm } from "react-hook-form";
import { addLabel } from "../store/labels";
import labelAPI from "../api/label";
import { deleteLabel } from "./../store/labels";

interface LabelsProps {}

interface IFormInput {
  name: string;
  type: string;
}

export const Labels: React.FC<LabelsProps> = ({}) => {
  const { labels } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { errors, register, handleSubmit } = useForm<IFormInput>();

  async function onSubmit(data: IFormInput) {
    const res = await dispatch(
      addLabel({ id: "", name: data.name, type: data.type })
    );
  }

  async function onDelete(labelid: string) {
    dispatch(deleteLabel(labelid));
  }

  return (
    <EuiPage restrictWidth={true}>
      <EuiFlexGroup direction="column" justifyContent="center">
        <EuiFlexItem>
          <EuiTitle>
            <h1>
              <b>Címkék</b>
            </h1>
          </EuiTitle>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiForm onSubmit={handleSubmit(onSubmit)} component="form">
            <EuiFormRow label="Név">
              <EuiFieldText
                name="name"
                inputRef={register({ required: true })}
              />
            </EuiFormRow>
            <EuiFormRow label="Típus">
              <EuiSelect
                name="type"
                options={labelAPI.types}
                inputRef={register}
              />
            </EuiFormRow>
            <EuiButton color="secondary" type="submit">
              Címke felvétele
            </EuiButton>
          </EuiForm>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup>
            {labels.map((label) => (
              // <EuiCard title={label.name} description={label.type} />
              <EuiFlexItem grow={false}>
                <EuiBadge
                  color={
                    labelAPI.colors.find((color) => color.value === label.type)
                      ?.color || "hollow"
                  }
                  iconType="cross"
                  iconSide="right"
                  iconOnClick={() => onDelete(label.id)}
                  iconOnClickAriaLabel="Címke törlése"
                >
                  {label.name}
                </EuiBadge>
              </EuiFlexItem>
            ))}
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPage>
  );
};
