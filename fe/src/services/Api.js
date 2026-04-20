// axios
import axios from 'axios'
import config from '@/config.json';

export default () => {
    return axios.create({
        baseURL: `${config.domain}`,
        headers: {
            Authorization: `Sky ${localStorage.getItem('tokenUser')}`
        }
    })
}
