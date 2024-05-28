import axios from "axios";
import { apiServer } from "../config";
export const getCsrfToken = () => {
  return axios.post(`${apiServer}/auth/token`, {withCredentials: true});
};
