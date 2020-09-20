import axios from "axios";
import { api } from "./";

export const getDataset = () => api.get(`/dataset`);

export default getDataset;
