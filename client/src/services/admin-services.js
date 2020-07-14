import axios from "axios";
import { api } from "./";

export const login = (payload) => api.post(`/login`, payload);
export const createAdmin = (payload) => api.post(`/admin`, payload);
export const updateAdmin = (username, payload) =>
	api.put(`/admin/${username}`, payload);
export const deleteAdmin = (username) => api.delete(`/admin/${username}`);
export const getAllAdmins = () => api.get(`/admin`);
export const getAdminByUsername = (username) => api.get(`/admin/${username}`);

const adminApis = {
	login,
	createAdmin,
	getAllAdmins,
	updateAdmin,
	deleteAdmin,
	getAdminByUsername,
};

export default adminApis;
