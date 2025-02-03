import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default axios;