import axios from "axios";
import config from  "../config";
export const getCsrfToken = () => {
  return axios.post(`${config.apiServer}/auth/token`, {withCredentials: true});
};
