// lib/unsplash.js
import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

const unsplashApi = axios.create({
	baseURL: "https://api.unsplash.com/",
	headers: {
		Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
	},
});

export const searchPhotos = async (query) => {
	try {
		const response = await unsplashApi.get(UNSPLASH_API_URL, {
			params: {
				query: `${query} isolated`, // Add 'isolated' to the search query
				client_id: UNSPLASH_ACCESS_KEY,
				per_page: 1,
				orientation: "portrait", // Optional: focus on vertical images
			},
		});

		// Find the first photo with a description that matches the item
		const photos = response.data.results;
		if (photos.length > 0) {
			return photos[0].urls.small; // Return the URL of the first image
		}
		return null;
	} catch (error) {
		console.error("Error fetching photos: ", error);
		return null;
	}
};
