
import { baseURL } from "@/lib/axiosInstance";
import axios from "axios";

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
