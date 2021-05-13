import http from "k6/http";
import { check, group, sleep } from "k6";

const API_URL = "https://localhost:5001/api";
const SLEEP_DURATION = 0.1;

export default function () {
  group("create class user journey", () => {
    // Login
    const payload = JSON.stringify({
      email: "aa@bb.hu",
      password: "password",
    });
    var params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const login_response = http.post(
      `${API_URL}/user/authenticate`,
      payload,
      params
    );

    check(login_response, {
      "is status 200": (r) => r.status === 200,
      "is token present": (r) => r.json().hasOwnProperty("token"),
    });
    params.headers["Authorization"] = `Bearer ${
      login_response.json()["token"]
    }`;
    sleep(SLEEP_DURATION);

    // Get issues
    const issue_response = http.get(`${API_URL}/issue`, params);
    check(issue_response, {
      "is status 200": (r) => r.status === 200,
      "is array": (r) => Array.isArray(r.json()),
    });
    sleep(SLEEP_DURATION);

    // Get classes
    const class_response = http.get(`${API_URL}/class`, params);
    check(class_response, {
      "is status 200": (r) => r.status === 200,
      "is array": (r) => Array.isArray(r.json()),
    });
    sleep(SLEEP_DURATION);

    // Add a new class
    const newClass = JSON.stringify({
      name: "Integrációs és ellenőrzési technikák",
      color: "#007bff",
      icon: "",
    });
    const new_class_response = http.post(`${API_URL}/class`, newClass, params);
    check(new_class_response, {
      "is status 200": (r) => r.status === 200,
      "is class returned": (r) =>
        r.json().hasOwnProperty("id") &&
        r.json().hasOwnProperty("name") &&
        r.json().hasOwnProperty("userID"),
    });
    sleep(SLEEP_DURATION);

    const delete_class_response = http.del(
      `${API_URL}/class/${new_class_response.json()["id"]}`,
      null,
      params
    );
    check(delete_class_response, {
      "is status 200": (r) => r.status === 200,
      "is class returned": (r) =>
        r.json().hasOwnProperty("id") &&
        r.json().hasOwnProperty("name") &&
        r.json().hasOwnProperty("userID"),
    });
    sleep(SLEEP_DURATION * 50);
  });
}
