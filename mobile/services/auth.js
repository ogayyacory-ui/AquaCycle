import axios from "axios";
import { API_URL } from "../constants/config";

function authUrl(path) {
  if (!API_URL || API_URL.includes("YOUR_COMPUTER_IP")) {
    throw new Error(
      "Set EXPO_PUBLIC_API_URL to the address of your Flask server before using authentication."
    );
  }

  return `${API_URL.replace(/\/+$/, "")}/auth/${path}`;
}

async function sendAuthRequest(path, payload) {
  const url = authUrl(path);

  try {
    const response = await axios.post(url, payload, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data?.user) {
      throw new Error(response.data?.error || "The server did not return an account.");
    }

    return response.data.user;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("The server took too long to respond. Please try again.");
    }
    if (!error.response) {
      throw new Error(
        "Could not reach the server. Check the API address and make sure Flask is running."
      );
    }
    throw error;
  }
}

export function signIn({ email, password }) {
  return sendAuthRequest("login", { email, password });
}

export function signUp({ name, email, phone, password }) {
  return sendAuthRequest("signup", { name, email, phone, password });
}

export function signInWithGoogle(idToken) {
  return sendAuthRequest("google", { id_token: idToken });
}
