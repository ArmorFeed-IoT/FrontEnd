import axios from "axios";

export default axios.create({
  baseURL: "https://armorfeedapi.azurewebsites.net/api/v1/",
  headers: { "Content-type": "application/json" },
});
