import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";

const App = () => {
  return (
    <React.StrictMode>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </React.StrictMode>
  );
};

export default App;
