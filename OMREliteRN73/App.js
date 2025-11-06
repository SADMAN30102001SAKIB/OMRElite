import React, { useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { requestStoragePermissions } from "./utils/permissions";

const App = () => {
  useEffect(() => {
    // Request storage permissions when app starts (Android only)
    if (Platform.OS === "android") {
      const initializePermissions = async () => {
        await requestStoragePermissions();
      };
      initializePermissions();
    }
  }, []);

  return (
    <React.StrictMode>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </React.StrictMode>
  );
};

export default App;
