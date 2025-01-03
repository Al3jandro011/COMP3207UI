import axios from "axios";

const rootUrl = "evecs.azurewebsites.net";

export const statusCheck = () => {
	return axios.get(`${rootUrl}/`);
};

// Events
export const createEvent = (data) => {
	return axios.post(`${rootUrl}/create_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const getEvent = (data) => {
	return axios.post(`${rootUrl}/get_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const makeCalendar = (data) => {
	return axios.post(`${rootUrl}/make_calendar?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

export const deleteEvent = (data) => {
	return axios.post(`${rootUrl}/delete_event?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`, data);
};

// Get locations and groups
export const getLocationsAndGroups = () => {
	return axios.get(`${rootUrl}/get_location_groups?code=${process.env.NEXT_PUBLIC_FUNCTION_APP_KEY}`);
};