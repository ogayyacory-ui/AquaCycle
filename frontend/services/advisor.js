import api from "./api";

export async function askAdvisor(message, context = {}) {
  const response = await api.post("/api/advisor", {
    message,
    context,
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.error || "Unable to contact AquaAI."
    );
  }

  return response.data;
}