const dev = {
  apiLink: "https://localhost:5001/api",
};

const prod = {
  apiLink: "https://localhost:5001/api", //use same as dev to make docker easy
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default {
  ...config,
};
