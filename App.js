import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Consulta from "./components/Consulta";
import Filme from "./components/Filme";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#6200EE", 
          },
          headerTintColor: "#fff", 
          headerTitleStyle: {
            fontWeight: "bold", 
          },
        }}
      >
        <Stack.Screen
          name="Consulta"
          component={Consulta}
          options={{
            title: "Buscar Filmes", 
          }}
        />
        <Stack.Screen
          name="Filme"
          component={Filme}
          options={{
            title: "Detalhes do Filme", 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
