import axios from "axios";
import { API_URL } from "../constants/config";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});


export async function getEvents() {

  const response = await api.get(
    "/events"
  );

  return response.data;
}


export async function getEvent(id) {

  const response = await api.get(
    `/events/${id}`
  );

  return response.data;
}


export async function createEvent(data) {

  const response = await api.post(
    "/events",
    data
  );

  return response.data;
}


export async function registerForEvent(
  id,
  data
) {

  const response = await api.post(
    `/events/${id}/register`,
    data
  );

  return response.data;
}


export async function createReport(data) {

  const response = await api.post(
    "/reports",
    data
  );

  return response.data;
}


export async function getSolutions() {

  const response = await api.get(
    "/solutions"
  );

  return response.data;
}


export async function calculateSimulator(
  items
) {

  const response = await api.post(
    "/simulator/calculate",
    {
      items
    }
  );

  return response.data;
}


export async function getImpact() {

  const response = await api.get(
    "/impact"
  );

  return response.data;
}

export async function getWeather(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("A valid GPS location is required to load local weather.");
  }

  if (API_URL.includes("YOUR_COMPUTER_IP")) {
    throw new Error(
      "Set EXPO_PUBLIC_API_URL to your computer's LAN address, such as http://192.168.1.10:5000/api."
    );
  }

  try {
    const response = await api.get("/weather", {
      params: { latitude, longitude },
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.error || "Unable to retrieve local weather.");
    }

    return response.data.data;
  } catch (error) {
    const serverMessage = error.response?.data?.error;
    if (serverMessage) {
      throw new Error(serverMessage);
    }
    throw error;
  }
}