import axios from 'axios';
import { api } from "./";

export const createCoords = payload => api.post(`/coords`, payload)
export const updateCoords = (id, payload) => api.put(`/coords/${id}`, payload)
export const uploadSiteImage = id => api.put(`/coords/image/${id}`)
export const deleteCoords = id => api.delete(`/coords/${id}`)
export const getAllCoords = () => api.get(`/coords`)
export const getCoordsById = id => api.get(`/coords/${id}`)
export const getCoordsByCode = code => api.get(`/coords/site/${code}`)

const siteCoordsApis = {
    createCoords,
    updateCoords,
    deleteCoords,
    getAllCoords,
    getCoordsById,
    uploadSiteImage,
}

export default siteCoordsApis