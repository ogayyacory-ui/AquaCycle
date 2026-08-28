import {
  Stack,
} from "expo-router";

import { COLORS } from "../constants/colors";


export default function RootLayout() {

  return (
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

    </Stack>
  );
}