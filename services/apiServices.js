import axios from 'axios';

const rootUrl = "https://evecs.azurewebsites.net/api";

const api = axios.create({
	baseURL: rootUrl,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	},
	withCredentials: false
});

// Events
// Implemented but not working
export const createEvent = (data) => {
	return api.post(`/create_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const getEvent = (data) => {
	return api.post(`/get_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const makeCalendar = (data) => {
	return api.post(`/make_calendar?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const updateEvent = (data) => {
	return api.post(`/update_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const deleteEvent = (data) => {
	return api.post(`/delete_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

// Get locations and groups
export const getLocationsAndGroups = () => {
	return api.get(`/get_location_groups?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`);
};

// AI
export const getAiResponse = (data) => {
	return api.post(`/create_event_gpt?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

// export const createTicket = () => {
// 	return axios.get(`${rootUrl}/create_ticket`);
// };

// export const getTicket = () => {
// 	return axios.get(`${rootUrl}/get_ticket`);
// };

// export const getTickets = () => {
// 	return axios.get(`${rootUrl}/get_tickets`);
// };

// export const updateTicket = () => {
// 	return axios.get(`${rootUrl}/update_ticket`);
// };

// export const deleteTicket = () => {
// 	return axios.get(`${rootUrl}/delete_ticket`);
// };