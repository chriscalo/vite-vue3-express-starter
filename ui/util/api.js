import http from "./http.js";

const api = {
  async get() {
    const { data } = await http.get(`/api`);
    return data;
  },
};

export default api;
