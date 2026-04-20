import axios from 'axios';
import store from '@/client/store';
import router from '@/client/router';
import config from '@/config.json';

const request = axios.create({
    baseURL: config.domain,
    timeout: 10000
})

const errorResponseHandler = (error) => {
    if(error.response.status == 401){
        store.dispatch("logout");
        router.push("/login")
    }
    return Promise.reject(error.response)
}

const errorRequestHandler = (error) => {
    return Promise.reject(error.request)
}

// request interceptor
request.interceptors.request.use(config => {
    const token = localStorage.getItem("userToken")
    if (token) {
        config.headers["authorization"] = 'Sky ' + token
    }
    return config
}, errorRequestHandler)

// response interceptor
request.interceptors.response.use((response) => {
    return response.data
}, errorResponseHandler)

export default request
