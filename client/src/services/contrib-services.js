import axios from 'axios';
import { api } from "./";

export const createContribution = payload => api.post(`/contribution`, payload)
export const updateContribution = (id, payload) => api.put(`/contribution/${id}`, payload)
export const deleteContribution = id => api.delete(`/contribution/${id}`)
export const getContributions = () => api.get(`/contribution`)
export const getContributionById = id => api.get(`/contribution/${id}`)
export const getContributionsByStatus = status => api.get(`/contribution/status/${status}`)

const contributionApis = {
    createContribution,
    updateContribution,
    deleteContribution,
    getContributions,
    getContributionById,
    getContributionsByStatus,
}

export default contributionApis