import { Issue } from "./issue";
import axios from "axios";
import config from "../config";

const ENDPOINT = "/column/";

export interface Column {
  id: String;
  name: String;
  issues: Issue[];
  order: Number;
}

let data: Column[] = [
  {
    id: "1",
    name: "Függőben",
    issues: [],
    order: 1,
  },
  {
    id: "2",
    name: "Folyamatban",
    issues: [],
    order: 2,
  },
  {
    id: "3",
    name: "Kész",
    issues: [],
    order: 3,
  },
];

export async function add(column: Column) {
  //data.push(column);
  const response = await axios.post<Column>(config.apiLink + ENDPOINT, column);
  return response.data;
}

export async function remove(id: String) {
  // data = data.filter((item) => item.id !== id);
  const response = await axios.delete<Column>(config.apiLink + ENDPOINT);
  return response.data;
}

export async function edit(edited: Column) {
  // const index = data.findIndex((item) => item.id === edited.id);
  // if (index === -1) return edited;
  // data[index] = edited;
  const response = await axios.put<Column>(
    config.apiLink + ENDPOINT + edited.id,
    edited
  );
  return response.data;
}

export async function addIssue(id: String, issueid: String) {
  // const index = data.findIndex((item) => item.id === id);
  // if (index === -1) return;
  // const issueIndex = data[index].issueids.findIndex(
  //   (issueid) => issueid === newIssue.id
  // );
  // if (issueIndex !== -1) return;
  // let clone = Object.assign({}, data[index]);
  // clone.issues = [...clone.issues, newIssue];
  // data[index] = clone;
  // data[index].issueids.push(newIssue.id as string);

  await axios.post<Column>(config.apiLink + ENDPOINT + "addissue", {
    columnid: id,
    issueid,
  });
  return { id, issueid };
}

export async function createAndAdd(id: String, newIssue: Issue) {
  newIssue.id = "";
  await axios.post<Column>(config.apiLink + ENDPOINT + "createandadd", {
    columnid: id,
    issue: newIssue,
  });
  return { id, newIssue };
}

export async function moveIssue(
  origin: String,
  destination: String,
  newIssue: Issue
) {
  // const index = data.findIndex((item) => item.id === id);
  // if (index === -1) return;
  // const issueIndex = data[index].issueids.findIndex(
  //   (issueid) => issueid === newIssue.id
  // );
  // if (issueIndex !== -1) return;
  // let clone = Object.assign({}, data[index]);
  // clone.issues = [...clone.issues, newIssue];
  // data[index] = clone;
  // data[index].issueids.push(newIssue.id as string);
  console.log(newIssue);
  await axios.post<Column>(config.apiLink + ENDPOINT + "moveissue", {
    origin,
    destination,
    issueid: newIssue.id,
  });
  return { origin, destination, newIssue };
}

export async function addIssueToFirstColumn(newIssue: Issue) {
  if (data.length === 0) return;
  const issueIndex = data[0].issues.findIndex(
    (issue) => issue.id === newIssue.id
  );
  if (issueIndex !== -1) return;
  let clone = Object.assign({}, data[0]);
  clone.issues = [...clone.issues, newIssue];
  data[0] = clone;
  data[0].issues.push(newIssue);
  return newIssue;
}

export async function removeIssue(id: String, removeId: String) {
  await axios.post<String>(config.apiLink + ENDPOINT + "removeissue", {
    columnid: id,
    issueid: removeId,
  });
  return { id, issueId: removeId };
  // const index = data.findIndex((item) => item.id === id);
  // if (index === -1) return;
  // const issueIndex = data[index].issues.findIndex(
  //   (item) => item.id === removeId
  // );
  // if (issueIndex === -1) return;
  // // let clone = Object.assign([], data[index].issues);
  // let clone = Object.assign({}, data[index]);
  // let clonedIssues = Object.assign([], clone.issues);
  // clonedIssues.splice(issueIndex, 1);
  // clone.issues = clonedIssues;
  // data[index] = clone;
  // data[index].issues.splice(issueIndex, 1);
  // //data[index].issues.splice(issueIndex, 1);
  // return { id, issueId: removeId };
}

export async function fetchAll() {
  const response = await axios.get<Column[]>(config.apiLink + ENDPOINT);
  return response.data;
}

const exported = {
  add,
  remove,
  edit,
  fetchAll,
  addIssue,
  removeIssue,
  addIssueToFirstColumn,
  moveIssue,
  createAndAdd,
};
export default exported;
