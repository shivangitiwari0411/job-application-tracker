import axios from "axios";

const API = axios.create({
    baseURL: "https://jobtracker-backend-kjmc.onrender.com"
});

export default API;