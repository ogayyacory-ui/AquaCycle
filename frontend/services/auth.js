import api from "./api";

function userFrom(response) {
  if (!response.data?.user) throw new Error(response.data?.error || "Unable to complete account request.");
  return response.data.user;
}

export async function signUpUser({ name, email, password }) {
  return userFrom(await api.post("/api/auth/signup", { name, email, password }));
}

export async function loginUser({ email, password }) {
  return userFrom(await api.post("/api/auth/login", { email, password }));
}

export async function signInWithGoogle(idToken) {
  return userFrom(await api.post("/api/auth/google", { id_token: idToken }));
}
