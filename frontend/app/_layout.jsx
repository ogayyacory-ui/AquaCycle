import {
  Stack,
} from "expo-router";

import { COLORS } from "../constants/colors";
import { AuthProvider } from "../context/AuthContext";


export default function RootLayout() {

  return (
    <AuthProvider>
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },

        headerTintColor: COLORS.text,

        headerTitleStyle: {
          fontWeight: "700",
        },

        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >

      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />

      <Stack.Screen
        name="events/index"
        options={{
          title: "Community Events",
        }}
      />

      <Stack.Screen
        name="events/create"
        options={{
          title: "Create Event",
        }}
      />

      <Stack.Screen
        name="events/[id]"
        options={{
          title: "Event",
        }}
      />

      <Stack.Screen
        name="report/index"
        options={{
          title: "Report a Problem",
        }}
      />

      <Stack.Screen
        name="report/[id]"
        options={{
          title: "Report Details",
        }}
      />

      <Stack.Screen
        name="officer/queue"
        options={{
          title: "Incident Queue",
        }}
      />

      <Stack.Screen
        name="officer/admin"
        options={{
          title: "Operations Overview",
        }}
      />

      <Stack.Screen
        name="solutions/index"
        options={{
          title: "Solutions",
        }}
      />

      <Stack.Screen
        name="simulator/index"
        options={{
          title: "Community Simulator",
        }}
      />

      <Stack.Screen
        name="advisor/index"
        options={{
          title: "AquaAI",
        }}
      />
      <Stack.Screen
        name="officer/index"
        options={{
          title: "Officer Dashboard",
        }}
      />
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />

    </Stack>
    </AuthProvider>
  );
}
