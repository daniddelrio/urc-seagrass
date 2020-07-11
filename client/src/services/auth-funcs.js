import axios from "axios";
import { api } from "./";
import { login } from "./admin-services";
import jwt from "jsonwebtoken";

export const isBrowser = () => {
	return typeof window !== "undefined";
};
export const getUser = () => {
	return isBrowser() && window.localStorage.getItem("adminUser")
		? JSON.parse(window.localStorage.getItem("adminUser"))
		: {};
};

const setUser = (user) => {
	isBrowser() &&
		window.localStorage.setItem("adminUser", JSON.stringify(user));
};

export const handleLogin = async (username, password) => {
	const payload = { username, password };
	const user = await login(payload)
		.then()
		.catch((err) => {
			return false;
		});

	if (user && user.data) {
		setUser(user.data);
		api.defaults.headers.common["Authorization"] = "JWT " + `${getUser().token}`;
		return true;
	}

	return false;
};

export const isLoggedIn = () => {
	const user = getUser();

	return !!user.token && !isTokenExpired();
};

export const isTokenExpired = () => {
	const user = getUser();
	const decodedToken = jwt.decode(user.token);
	if(decodedToken == null) return true;
	const expiryDate = new Date(decodedToken.exp * 1000);

	return expiryDate && Date.now() > expiryDate;
};

export const logout = (callback) => {
	setUser({});
	// if (callback) {
	// 	callback();
	// }
};
