import axios from "axios";
import { BASE_URL } from "../utils/constants";

const BackendAPI = axios.create({
    baseURL: BASE_URL,
});

export default BackendAPI;