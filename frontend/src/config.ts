const dev = {
  apiLink: "https://localhost:5001/api",
};

const prod = {
  apiLink: "",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default {
  ...config,
};
