import axios from "axios";

export const axiosConfig = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
