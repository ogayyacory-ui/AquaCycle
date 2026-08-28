import axios from "axios";
import { API_BASE_URL } from "../constants/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


// ============================================================
// HEALTH
// ============================================================

export const getHealth = async () => {
  const response = await api.get("/api/health");

  return response.data;
};


// ============================================================
// EVENTS
// ============================================================

export const getEvents = async () => {
  const response = await api.get("/api/events");

  return response.data;
};


export const getEvent = async (eventId) => {
  const response = await api.get(
    `/api/events/${eventId}`
  );

  return response.data;
};


export const createEvent = async (eventData) => {
  const response = await api.post(
    "/api/events",
    eventData
  );

  return response.data;
};


export const registerForEvent = async (
  eventId,
  registrationData
) => {
  const response = await api.post(
    `/api/events/${eventId}/register`,
    registrationData
  );

  return response.data;
};


// ============================================================
// WATER REPORTS
// ============================================================

export const getReports = async () => {
  const response = await api.get(
    "/api/reports"
  );

  return response.data;
};


export const createReport = async (reportData) => {
  const response = await api.post(
    "/api/reports",
    reportData
  );

  return response.data;
};


// ============================================================
// SOLUTIONS
// ============================================================

export const getSolutions = async () => {
  const response = await api.get(
    "/api/solutions"
  );

  return response.data;
};


export const getSolution = async (solutionId) => {
  const response = await api.get(
    `/api/solutions/${solutionId}`
  );

  return response.data;
};


// ============================================================
// SIMULATOR
// ============================================================

export const getSimulatorOptions = async () => {
  const response = await api.get(
    "/api/simulator/options"
  );

  return response.data;
};


export const calculateSimulator = async (systems) => {
  const response = await api.post(
    "/api/simulator/calculate",
    {
      systems,
    }
  );

  return response.data;
};


// ============================================================
// IMPACT
// ============================================================

export const getImpact = async () => {
  const response = await api.get(
    "/api/impact"
  );

  return response.data;
};


export default api;