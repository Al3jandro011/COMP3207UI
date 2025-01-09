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

export const loginUser = (data) => {
	return api.post(`/login_user?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);

};

export const getEvent = (data) => {
	return api.post(`/get_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const makeCalendar = (data) => {
	console.log('makeCalendar request data:', data); // Log request data
	return api.post(`/make_calendar?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, {
		start_date: data.start_date,
		end_date: data.end_date,
		filters: data.filters || []
	});
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

// export const updateUser = (data) => {
// 	// Create request body with all possible fields
// 	const requestBody = {
// 		user_id: data.user_id,
// 		email: data.email,
// 		new_email: data.new_email,
// 		password: data.password,
// 		auth: data.auth,
// 		groups: data.groups // Make sure groups is included
// 	};

// 	// Remove undefined fields
// 	Object.keys(requestBody).forEach(key => 
// 		requestBody[key] === undefined && delete requestBody[key]
// 	);

// 	return api.post(`/update_user?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, requestBody);
// };

// Add this new function
export const getValidGroups = () => {
	return api.get(`/get_valid_groups?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`);
};

export const getTags = () => {
	return api.get(`/get_valid_tags?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`);
};

// Add this function to get user IDs from emails
export const getUserIdFromEmail = (emails) => {
	// Convert single email to array if needed
	const emailData = {
		emails: Array.isArray(emails) ? emails : [emails]
	};

	return api.post(`/get_user_id_from_email?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, emailData);
};

// Add this function to update ticket validation status
export const updateTicket = (data) => {
	return api.post(`/update_ticket?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, {
		ticket_id: data.ticket_id,
		validated: data.validated
	});
};

export const registerUser = (userData) => {
	return api.post(`/register_user?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, userData);
};
// Get account details
export const getAccountDetails = (data) => {
	return api.post(`/get_account_details?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, {
		user_id: data.user_id
	});
};

// Update user details
export const updateUser = (data) => {
	const updateData = {
		user_id: data.user_id
	};

	// Only include fields that are provided
	if (data.new_email) {
		updateData.new_email = data.new_email;
	}
	if (data.password) {
		updateData.password = data.password;
	}
	if (typeof data.auth !== 'undefined') {
		updateData.auth = data.auth;
	}

	return api.post(`/update_user?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, updateData);
};
