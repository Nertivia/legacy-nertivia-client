import axios from "axios";
import config from "../config";

export const instance = () => {
  return axios.create({
    baseURL: config.domain,
    withCredentials: true
  });
};

export const wrapper = promise => {
  return promise
    .then(result => ({ ok: true, result }))
    .catch(error => Promise.resolve({ ok: false, error }));
};
