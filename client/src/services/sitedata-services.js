import axios from 'axios';
import { api } from "./";

export const createData = payload => api.post(`/sitedata`, payload)
export const getAllData = () => api.get(`/sitedata`)
export const updateData = (id, payload) => api.put(`/sitedata/${id}`, payload)
export const deleteData = id => api.delete(`/sitedata/${id}`)
export const getDataById = id => api.get(`/sitedata/${id}`)
export const getDataByYear = id => api.get(`/sitedata/${year}`)

const siteDataApis = {
    insertData,
    getAllData,
    updateData,
    deleteData,
    getDataById,
    getDataByYear,
}

export default siteDataApis