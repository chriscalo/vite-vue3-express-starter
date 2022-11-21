import http from "./http.js";

const api = {
  async get(name) {
    const { data } = await http.get(`/api?name=${name}`);
    return data;
  },
};

export default api;
