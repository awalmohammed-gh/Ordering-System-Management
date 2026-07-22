import axios from "axios";


export const api = axios({
    baseURL:"http://localhost:3000/api",
    withCredentials:true
})