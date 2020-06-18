import axios from 'axios';
const dotenv = require('dotenv');
dotenv.config();

export const api = axios.create({
    baseURL: `${process.env.BASE_URL}/api`,
});