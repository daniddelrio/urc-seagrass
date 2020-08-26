import axios from "axios";
import { api } from "./";

export const createField = (payload) => api.post(`/parameters`, payload);
export const updateField = (id, payload) =>
	api.put(`/parameters/${id}`, payload);
export const getAllFields = () => api.get(`/parameters`);
export const getFieldById = (id) => api.get(`/parameters/${id}`);

const paramsApi = {
	createField,
	updateField,
	getAllFields,
	getFieldById,
};

export default paramsApi;
