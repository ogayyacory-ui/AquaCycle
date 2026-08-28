import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00B8D9",
        tabBarInactiveTintColor: "#78909C",
        tabBarStyle: {
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0F2F1",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Water Map",
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}