import React, { useEffect, useState, useLayoutEffect, useContext } from 'react'; 
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_KEY } from '@env';
import { ThemeContext } from '../contexts/ThemeContext'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';

const API_URL = 'https://api.themoviedb.org/3/discover/movie';

const CategoriaDetalhes = ({ route, navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const { genreId, genreName } = route.params;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Configurando o botão de alternar tema no cabeçalho
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
  }, [navigation, toggleTheme, theme.mode, theme.colors.text]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR`);
        setMovies(response.data.results);
      } catch (err) {
        setError('Erro ao buscar filmes desta categoria.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [genreId]);

  if (loading) return <ActivityIndicator size="large" color="#1E90FF" style={styles.loading} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Categoria: {genreName}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => navigation.navigate('Filme', { movieId: item.id })}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.poster}
            />
            <View style={styles.info}>
              <Text style={[styles.movieTitle, { color: theme.colors.text }]}>{item.title}</Text>
              <Text style={styles.date}>Lançamento: {item.release_date || 'Data desconhecida'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loading: { marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginVertical: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  movieItem: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  poster: { width: 80, height: 120, borderRadius: 5, marginRight: 15 },
  info: { justifyContent: 'center' },
  movieTitle: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 14, color: 'gray' },
});

export default CategoriaDetalhes;
