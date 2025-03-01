import React, { useContext } from 'react';
import { Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Consulta from './components/Consulta';
import Filme from './components/Filme';
import Home from './components/Home';
import Categorias from './components/Categorias';
import CategoriaDetalhes from './components/CategoriaDetalhes';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { theme } = useContext(ThemeContext);

  // Define o tema de navegação
  const navTheme = {
    dark: theme.isDark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.primary,
      text: theme.colors.text,
      border: theme.colors.primary,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.text,
          // Define um headerTitle customizado para evitar o erro
          headerTitle: (props) => (
            <Text
              style={
                Platform.select({
                  web: { fontSize: 18, color: theme.colors.text },
                  default: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
                })
              }
            >
              {props.children}
            </Text>
          ),
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: 'Início' }} />
        <Stack.Screen name="Consulta" component={Consulta} options={{ title: 'Buscar Filmes' }} />
        <Stack.Screen name="Filme" component={Filme} options={{ title: 'Detalhes do Filme' }} />
        <Stack.Screen name="Categorias" component={Categorias} options={{ title: 'Categorias' }} />
        <Stack.Screen name="CategoriaDetalhes" component={CategoriaDetalhes} options={{ title: 'Filmes da Categoria' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
