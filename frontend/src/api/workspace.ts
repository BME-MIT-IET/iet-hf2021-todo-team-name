import axios from "axios";
import config from "../config";
import { Column } from "./column";
import { User } from "./user";

const ENDPOINT = "/workspace/";

export interface Workspace {
  id: string;
  name: string;
  users: User[];
  columns: Column[];
}

export async function getWorkspace(id: string) {
  const response = await axios.get<Workspace>(config.apiLink + ENDPOINT + id);
  return response.data;
}

export async function getAll() {
  const response = await axios.get<Workspace[]>(config.apiLink + ENDPOINT);
  return response.data;
}

export async function create(name: string) {
  const response = await axios.post<Workspace>(
    config.apiLink + ENDPOINT,
    JSON.stringify(name),
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
}

export async function addUser(id: string, userID: string) {
  const response = await axios.post<Workspace>(
    config.apiLink + ENDPOINT + `adduser/${id}`,
    userID
  );
  return response.data;
}

export async function changeUsers(id: string, userIDs: string[]) {
  const res = await axios.post<Workspace>(
    config.apiLink + ENDPOINT + `${id}/userchange`,
    userIDs
  );
  return res.data;
}

const exported = {
  getWorkspace,
  getAll,
  create,
  addUser,
  changeUsers,
};
export default exported;
