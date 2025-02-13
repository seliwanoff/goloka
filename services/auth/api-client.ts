
import { baseURL } from "@/lib/axiosInstance";
import axios from "axios";
//remember to check and resolve some fixes
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
