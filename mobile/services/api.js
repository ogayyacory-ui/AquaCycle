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