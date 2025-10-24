import axios from 'axios';

const axiosNormal = axios.create({
    baseURL: 'https://porinity-server.vercel.app',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axiosNormal;