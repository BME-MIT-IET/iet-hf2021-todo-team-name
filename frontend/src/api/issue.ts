import { Class } from "./class";
import axios from "axios";
import config from "../config";
import { Label } from "./label";

const ENDPOINT = "/issue/";

export interface Issue {
  id: String;
  title: String;
  body: String;
  relevantClass: Class | null;
  type: "issue" | "event";
  date?: String;
  timespan?: String;
  deadline?: String;
  start?: String;
  end?: String;
  labels?: Label[];
}

/*let data: Issue[] = [
  {
    id: "1",
    title: "Feladat",
    body: "...",
    relevantClass: {
      name: "IT Eszközök Technológiája",
      color: "#007bff",
      id: "329a6d3d-4ddb-4f87-9b88-22dbf3c00d93",
      icon: "",
    },
    type: "issue",
    deadline: new Date().toDateString(),
  },
  {
    id: "2",
    title: "Másik feladat",
    body: "Törzsszövegőrmester",
    relevantClass: {
      name: "Témalaboratórium",
      color: "#e83e8c",
      id: "d7fb58a6-dea7-4808-8e36-e6b384999f89",
      icon: "",
    },
    type: "issue",
    deadline: new Date().toDateString(),
  },
];*/

export async function add(issue: Issue) {
  //data.push(issue);
  //return issue;
  issue.id = "";
  const response = await axios.post<Issue>(config.apiLink + ENDPOINT, issue);
  return response.data;
}

export async function remove(id: String) {
  //data = data.filter((item) => item.id !== id);
  const response = await axios.delete<String>(config.apiLink + ENDPOINT + id);
  return response.data;
}

export async function edit(edited: Issue) {
  // const index = data.findIndex((item) => item.id === edited.id);
  // if (index === -1) return edited;
  // data[index] = edited;
  // return edited;
  const response = await axios.put<Issue>(
    config.apiLink + ENDPOINT + edited.id,
    edited
  );
  return response.data;
}

export async function fetchAll() {
  // return new Promise<Issue[]>((resolve) => {
  //   setTimeout(resolve, 300, data);
  // });
  const response = await axios.get<Issue[]>(config.apiLink + ENDPOINT);
  return response.data;
}

let cancelTokenSource = axios.CancelToken.source();

export async function search(query: string) {
  if (query === "") return [];
  cancelTokenSource = axios.CancelToken.source();
  const response = await axios.get<Issue[]>(
    config.apiLink + ENDPOINT + `search/${query}`,
    { cancelToken: cancelTokenSource.token }
  );
  return response.data;
}

const exported = {
  add,
  remove,
  edit,
  fetchAll,
  search,
  cancelTokenSource,
};

export default exported;
