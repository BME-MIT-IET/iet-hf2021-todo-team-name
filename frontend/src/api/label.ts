import axios from "axios";

import config from "../config";

const ENDPOINT = "/label/";

export interface Label {
  id: string;
  type: string;
  name: string;
}

export async function add(label: Label) {
  label.id = "";
  const response = await axios.post<Label>(config.apiLink + ENDPOINT, label);
  return response.data;
}

export async function getAll() {
  const response = await axios.get<Label[]>(config.apiLink + ENDPOINT);
  return response.data;
}

export async function deleteLabel(labelid: string) {
  const response = await axios.delete(config.apiLink + ENDPOINT + labelid);
  return labelid;
}

const types = [
  {
    value: "none",
    text: "Nincs",
  },
  {
    value: "status",
    text: "Állapot",
  },
  {
    value: "priority",
    text: "Prioritás",
  },
];

const colors = [
  {
    value: "none",
    color: "hollow",
  },
  {
    value: "status",
    color: "secondary",
  },
  {
    value: "priority",
    color: "danger",
  },
];

const exported = {
  add,
  getAll,
  deleteLabel,
  types,
  colors,
};

export default exported;
