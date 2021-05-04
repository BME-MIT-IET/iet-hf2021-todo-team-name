import axios from "axios";
import config from "../config";
export interface User {
  id: String;
  name: String;
  email: String;
}

export interface AuthenticateResult {
  user: User;
  token: string;
}

const ENDPOINT = "/user/";

export async function login(email: String, password: String) {
  const res = await axios.post<AuthenticateResult>(
    config.apiLink + ENDPOINT + "authenticate",
    { email, password }
  );
  return res.data;
}

export async function register(name: string, email: string, password: string) {
  const res = await axios.post<AuthenticateResult>(
    config.apiLink + ENDPOINT + "register",
    { name, email, password }
  );
  return res.data;
}

export async function getAll() {
  const res = await axios.get<User[]>(config.apiLink + ENDPOINT);
  return res.data;
}

const exported = {
  login,
  register,
  getAll,
};
export default exported;
