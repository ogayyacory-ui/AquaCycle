import api from "./api";

export async function getWeather(latitude, longitude) {
  const response = await api.get("/api/weather", {
    params: {
      latitude,
      longitude,
    },
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.error || "Unable to retrieve weather data."
    );
  }

  return response.data.data;
}

export async function searchCity(city) {
  const response = await api.get("/api/weather/search", {
    params: {
      city,
    },
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.error || "Unable to search for that location."
    );
  }

  return response.data.data || [];
}