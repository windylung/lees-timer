import axios from 'axios';

let apiUrl = "";

if (process.env.NODE_ENV === "development") {
  apiUrl = "http://localhost:8080/api/";
} else if (process.env.NODE_ENV === "production") {
  apiUrl = "https://www.lesstimer.site/api/";
}

const instance = axios.create({
  baseURL: apiUrl
});

export default instance;
