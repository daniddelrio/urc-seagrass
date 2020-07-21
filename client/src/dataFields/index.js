// Data Fields imported from JSON file to make it easier to add more fields	
import axios from 'axios';	
import { api } from "../services";	

let dataFields = [{test: "yes"}];	
const getParameters = async () => {	
	const res = await api.get(`/parameters`);	
	return res.data;	
}	

export default getParameters