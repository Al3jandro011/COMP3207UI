import axios from "axios";

const rootUrl = "evecs.azurewebsites.net";

export const statusCheck = () => {
	return axios.get(`${rootUrl}/`);
};

export const createTicket = () => {
	return axios.get(`${rootUrl}/create_ticket`);
};

export const getTicket = () => {
	return axios.get(`${rootUrl}/get_ticket`);
};

export const getTickets = () => {
	return axios.get(`${rootUrl}/get_tickets`);
};

export const updateTicket = () => {
	return axios.get(`${rootUrl}/update_ticket`);
};

export const deleteTicket = () => {
	return axios.get(`${rootUrl}/delete_ticket`);
};