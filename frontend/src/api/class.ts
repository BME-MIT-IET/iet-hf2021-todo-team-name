import axios from "axios";
import config from "../config";

const ENDPOINT = "/class/";

export interface Class {
  id: String;
  name: String;
  color: String;
  icon: String;
}

/*let data: Class[] = [
  {
    name: "IT Eszközök Technológiája",
    color: "#007bff",
    id: "329a6d3d-4ddb-4f87-9b88-22dbf3c00d93",
    icon: "",
  },
  {
    name: "Objektumorientált Szoftvertervezés",
    color: "#6610f2",
    id: "54c9e3e2-f7f5-4d1d-84f3-9f268fec1824",
    icon: "",
  },
  {
    name: "Témalaboratórium",
    color: "#e83e8c",
    id: "d7fb58a6-dea7-4808-8e36-e6b384999f89",
    icon: "",
  },
  {
    name: "Mobil- és Webes Szoftverek",
    color: "#dc3545",
    id: "8071f6ff-3cc7-4b84-a046-dae333f0c523",
    icon: "",
  },
  {
    name: "Adatvezérelt Rendszerek",
    color: "#fd7e14",
    id: "cda7425c-323c-43f9-847d-553cd0fb7512",
    icon: "",
  },
  {
    name: "Mesterséges Intelligencia",
    color: "#28a745",
    id: "f5b3ed6f-ee74-4c4c-aaed-a714ee7ecbca",
    icon: "",
  },
  {
    name: "Mikro- és Makroökönómia",
    color: "#6c757d",
    id: "2738b065-48ac-468a-b6e1-fd9856ec55e3",
    icon: "",
  },
  {
    name: "Üzleti Jog",
    color: "#343a40",
    id: "f955aaee-045b-42de-8a4a-2b8f63440623",
    icon: "",
  },
];*/

export async function add(item: Class) {
  // data.push(item);
  // return item;
  item.id = "";
  const response = await axios.post<Class>(config.apiLink + ENDPOINT, item);
  return response.data;
}

export async function remove(id: String) {
  //data = data.filter((item) => item.id !== id);
  const response = await axios.delete<Class>(config.apiLink + ENDPOINT + id);
  return response.data;
}

export async function edit(edited: Class) {
  // const index = data.findIndex((item) => item.id === edited.id);
  // if (index === -1) return edited;
  // data[index] = edited;
  const response = await axios.put<Class>(
    config.apiLink + ENDPOINT + edited.id,
    edited
  );
  return response.data;
  //return edited;
}

export async function fetchAll() {
  // return new Promise<Class[]>((resolve) => {
  //   setTimeout(resolve, 300, data);
  // });
  const response = await axios.get<Class[]>(config.apiLink + ENDPOINT);
  return response.data;
}

const exported = {
  fetchAll,
  add,
  remove,
  edit,
};

export default exported;
