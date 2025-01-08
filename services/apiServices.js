import axios from 'axios';

const rootUrl = "https://evecs.azurewebsites.net/api/";

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

export const getLocations = () => {
	return api.get(`/get_location?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`);
};

// AI
export const getAiResponse = (data) => {
	return api.post(`/create_event_gpt?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const createTicket = (data) => {
	return api.post(`/create_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, {
		user_id: data.user_id,
		event_id: data.event_id,
		email: data.email
	});
};

export const getTicket = (data) => {
	return api.post(`/get_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const deleteTicket = (data) => {
	return api.post(`/delete_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

// Add this function to get all events
export const getAllEvents = () => {
	return api.post(`/get_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, {});
};

// Add this function to get user's tickets
export const getUserTickets = (userId) => {
	return api.post(`/get_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, {
		user_id: userId
	});
};

// Add these new functions
export const getUserDetails = (data) => {
	return api.post(`/get_account_details?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, {
		user_id: data.user_id
	});
};

export const updateUser = (data) => {
	// Create request body with all possible fields
	const requestBody = {
		user_id: data.user_id,
		email: data.email,
		new_email: data.new_email,
		password: data.password,
		auth: data.auth,
		groups: data.groups // Make sure groups is included
	};

	// Remove undefined fields
	Object.keys(requestBody).forEach(key => 
		requestBody[key] === undefined && delete requestBody[key]
	);

	return api.post(`/update_user?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, requestBody);
};

// Add this new function
export const getValidGroups = () => {
	return api.get(`/get_valid_groups?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`);
};

export const getTags = () => {
	return api.get(`/get_valid_tags?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`);
};
