import axios from 'axios';

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

export const api = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/api`,
});