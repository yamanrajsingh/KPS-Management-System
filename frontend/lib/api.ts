import axios from "axios";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const api = axios.create({
   
  baseURL: `${apiBaseUrl}/api/students`,
  headers: { "Content-Type": "application/json" },
});

