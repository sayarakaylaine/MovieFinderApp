import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_KEY } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { ThemeContext } from '../contexts/ThemeContext';
import Icon2 from 'react-native-vector-icons/FontAwesome'; 

const API_URL = 'https://api.themoviedb.org/3/genre/movie/list';

const iconMap = {
  Action: 'movie',
  Comedy: 'sentiment-very-satisfied',
  Drama: 'theaters',
  Horror: 'sentiment-dissatisfied',
  Romance: 'favorite',
  Thriller: 'visibility',
};

const Categorias = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Configura o botão de tema no header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>        
          <Icon2
            name={theme.mode === 'dark' ? 'moon' : 'sun-o'} 
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, toggleTheme, theme.colors.text]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_URL}?api_key=${API_KEY}&language=pt-BR`);
        setGenres(response.data.genres);
      } catch (err) {
        setError('Erro ao buscar categorias.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#1E90FF" style={styles.loading} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Categorias</Text>
      <FlatList
        data={genres}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => {
          const iconName = iconMap[item.name] || 'movie'; 
          return (
            <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}
            onPress={() => navigation.navigate('CategoriaDetalhes', { genreId: item.id, genreName: item.name })}
            >
              <Icon name={iconName} size={50} color={theme.colors.icon} style={styles.icon} /> 
             <Text style={[styles.cardText, { color: theme.colors.text }]}>{item.name}</Text> 
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loading: { marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginVertical: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'left' },
  flatListContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: 150,
    height: 180,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  icon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Categorias;
