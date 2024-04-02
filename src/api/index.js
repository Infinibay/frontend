import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

API.interceptors.request.use(
  function (config) {
    config.headers.authorization = Cookies.get("token") || "";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

API.signUp = (data) => {
  return API.post("/auth/sign-up", data);
};

API.signIn = (data) => {
  return API.post("/auth/sign-in", data);
};

export { API };
