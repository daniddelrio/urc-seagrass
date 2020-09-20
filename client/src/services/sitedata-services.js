import axios from 'axios';
import { api } from "./";

export const createData = payload => api.post(`/sitedata`, payload)
export const updateData = (id, payload) => api.put(`/sitedata/${id}`, payload)
export const deleteData = id => api.delete(`/sitedata/${id}`)
export const getAllData = () => api.get(`/sitedata`)
export const getDataById = id => api.get(`/sitedata/${id}`)
export const getDataByYear = year => api.get(`/sitedata/year/${year}`)
export const getAllYears = () => api.get(`/year`)

const siteDataApis = {
    createData,
    updateData,
    deleteData,
    getAllData,
    getDataById,
    getDataByYear,
    getAllYears,
}

export default siteDataApis