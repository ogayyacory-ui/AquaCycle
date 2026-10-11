import { createContext, useContext, useMemo, useState } from "react";

import { loginUser, signInWithGoogle as verifyGoogleSignIn, signUpUser } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const value = useMemo(() => ({
    user,
    loading,
    async signUp(payload) {
      setLoading(true);
      try {
        const nextUser = await signUpUser(payload);
        setUser(nextUser);
        return nextUser;
      } finally {
        setLoading(false);
      }
    },
    async signIn(payload) {
      setLoading(true);
      try {
        const nextUser = await loginUser(payload);
        setUser(nextUser);
        return nextUser;
      } finally {
        setLoading(false);
      }
    },
    async signInWithGoogle(idToken) {
      setLoading(true);
      try {
        const nextUser = await verifyGoogleSignIn(idToken);
        setUser(nextUser);
        return nextUser;
      } finally {
        setLoading(false);
      }
    },
    signOut() {
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
