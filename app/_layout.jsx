import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router"; 
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CheckInfoProvider } from "./AllContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CheckInfoProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="Login" options={{ title: "Login" }} />
          <Stack.Screen
            name="SupervisorDashboard"
            options={{ title: "Supervisor Dashboard" }}
          />
          <Stack.Screen
            name="SupervisorCheckout"
            options={{ title: "Supervisor Checkout" }}
          />
          <Stack.Screen name="CheckIn" options={{ title: "Check-In" }} />
          <Stack.Screen
            name="SpecialReEntry"
            options={{ title: "Special Re-Entry" }}
          />
          <Stack.Screen
            name="+not-found"
            options={{ title: "Page Not Found" }}
          />
        </Stack>
      </CheckInfoProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
