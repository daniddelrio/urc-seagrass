import axios from 'axios';
import { api } from "./";

export const createAdmin = payload => api.post(`/admin`, payload)
export const getAllAdmins = () => api.get(`/admins`)
export const updateAdmin = (username, payload) => api.put(`/admin/${username}`, payload)
export const deleteAdmin = username => api.delete(`/admin/${username}`)
export const getAdminByUsername = username => api.get(`/admin/${username}`)

const adminApis = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    getAdminByUsername,
}

export default adminApis