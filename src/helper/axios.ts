import axios from "axios";

const api = axios.create({
  baseURL: "https://engineering-test-backend.onrender.com/",
});

api.interceptors.request.use(function (config) {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
