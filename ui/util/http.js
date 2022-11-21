import axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

const http = axios.create({
  adapter: fetchAdapter,
  method: "GET",
  headers: {
    "Accept": "application/json;charset=UTF-8",
  },
  cache: "no-cache",
  redirect: "error",
});

export default http;
