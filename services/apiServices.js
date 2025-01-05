import axios from "axios";

const rootUrl = "https://evecs.azurewebsites.net/api";

export const statusCheck = () => {
	return axios.get(`${rootUrl}/`);
};

export const createTicket = (data) => {
	return axios.post(`${rootUrl}/create_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const getTicket = (data) => {
	return axios.get(`${rootUrl}/get_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const deleteTicket = (data) => {
	return axios.get(`${rootUrl}/delete_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

