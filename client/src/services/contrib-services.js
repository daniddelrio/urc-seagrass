import axios from 'axios';
import { api } from "./";

export const createContribution = payload => api.post(`/contribution`, payload)
export const getContributions = () => api.get(`/contributions`)
export const updateContribution = (id, payload) => api.put(`/contribution/${id}`, payload)
export const deleteContribution = id => api.delete(`/contribution/${id}`)
export const getContributionById = id => api.get(`/contribution/${id}`)
export const getContributionByStatus = status => api.get(`/contribution/${status}`)

const siteContributionApis = {
    insertContribution,
    getContributions,
    updateContribution,
    deleteContribution,
    getContributionById,
    getContributionByStatus,
}

export default contributionApis