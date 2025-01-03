import axios from "axios";

const rootUrl = "evecs.azurewebsites.net";

export const statusCheck = () => {
	return axios.get(`${rootUrl}/`);
};
