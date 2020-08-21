// Data Fields imported from JSON file to make it easier to add more fields	
import axios from 'axios';	
import { api } from "../services";	

const getParameters = async () => {	
	const res = await api.get(`/parameters`);	
	return res.data.data;	
}	

export default getParameters