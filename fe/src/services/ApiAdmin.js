// axios
import axios from 'axios'
import config from '@/config.json';
import router from "@/router"

const request = axios.create({
    baseURL: config.domain,
})

const errorResponseHandler = (error) => {
    if(error.response.status == 401){
        localStorage.removeItem("token")
        router.push({name : 'page-login'})
    }
    return Promise.reject(error.response)
}

const errorRequestHandler = (error) => {
    return Promise.reject(error.request)
}

// request interceptor
request.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers["authorization"] = 'Sky ' + token
    }
    return config
}, errorRequestHandler)

// response interceptor
request.interceptors.response.use((response) => {
    return response
}, errorResponseHandler)

export default () => request
