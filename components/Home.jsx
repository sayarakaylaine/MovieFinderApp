import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import { API_KEY } from '@env';
import { ThemeContext } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; 

// Componente para cada seção de carrossel
const CarouselSection = ({ title, data, loading, navigation, onPressVerTodos }) => {
  const { theme } = useContext(ThemeContext);
  const flatListRef = useRef(null);
  const currentOffsetRef = useRef(0); 
  const scrollStep = 120; 

  const scrollLeft = () => {
    if (flatListRef.current) {
      // Calcula novo offset subtraindo o scrollStep, garantindo que não fique negativo
      const newOffset = currentOffsetRef.current - scrollStep;
      const finalOffset = newOffset < 0 ? 0 : newOffset;
      flatListRef.current.scrollToOffset({ offset: finalOffset, animated: true });
      currentOffsetRef.current = finalOffset;
    }
  };

  const scrollRight = () => {
    if (flatListRef.current) {
      // Calcula novo offset somando o scrollStep
      const newOffset = currentOffsetRef.current + scrollStep;
      flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
      currentOffsetRef.current = newOffset;
    }
  };

  return (
    <View style={carouselStyles.container}>
      <View style={carouselStyles.header}>
        <Text style={[carouselStyles.title, { color: theme.colors.text }]}>{title}</Text>
        <TouchableOpacity onPress={onPressVerTodos}>
          <Text style={[carouselStyles.verTodos, { color: theme.colors.text }]}>Ver Todos</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={{ marginVertical: 10 }} />
      ) : (
        <View style={carouselStyles.carouselContainer}>
          <TouchableOpacity onPress={scrollLeft} style={carouselStyles.arrowButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <FlatList
            data={data.slice(0, 30)} 
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              currentOffsetRef.current = event.nativeEvent.contentOffset.x;
            }}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={carouselStyles.movieItem}
                onPress={() => navigation.navigate('Filme', { movieId: item.id })}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                  style={carouselStyles.poster}
                />
                <Text style={[carouselStyles.movieTitle, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity onPress={scrollRight} style={carouselStyles.arrowButton}>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Componente para a barra de navegação fixa na parte inferior
const BottomNavigation = ({ navigation, theme }) => (
    <View style={[styles.bottomNav, { backgroundColor: theme.colors.primary }]}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')} 
        style={styles.bottomNavItem}
      >
        <Ionicons name="home-outline" size={28} color={theme.colors.text} />
        <Text style={[styles.bottomNavLabel, { color: theme.colors.text }]}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Consulta')} 
        style={styles.bottomNavItem}
      >
        <Ionicons name="search-outline" size={28} color={theme.colors.text} />
        <Text style={[styles.bottomNavLabel, { color: theme.colors.text }]}>Busca</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Categorias')} 
        style={styles.bottomNavItem}
      >
        <Ionicons name="list-outline" size={28} color={theme.colors.text} />
        <Text style={[styles.bottomNavLabel, { color: theme.colors.text }]}>Categorias</Text>
      </TouchableOpacity>
    </View>
  );
  

const Home = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loadingTopRated, setLoadingTopRated] = useState(true);

  // Configura o botão de tema no header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>        
          <Icon
            name={theme.mode === 'dark' ? 'moon' : 'sun-o'} 
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, toggleTheme, theme.colors.text]);

  useEffect(() => {
    // Filmes em destaque (popular)
    const fetchFeaturedMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`
        );
        setFeaturedMovies(response.data.results);
      } catch (error) {
        console.error('Erro ao buscar filmes em destaque:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    // Próximos lançamentos
    const fetchUpcomingMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=pt-BR`
        );
        setUpcomingMovies(response.data.results);
      } catch (error) {
        console.error('Erro ao buscar próximos lançamentos:', error);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    // Mais bem avaliados
    const fetchTopRatedMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=pt-BR`
        );
        setTopRatedMovies(response.data.results);
      } catch (error) {
        console.error('Erro ao buscar filmes mais bem avaliados:', error);
      } finally {
        setLoadingTopRated(false);
      }
    };

    fetchFeaturedMovies();
    fetchUpcomingMovies();
    fetchTopRatedMovies();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <CarouselSection
          title="Em Destaque"
          data={featuredMovies}
          loading={loadingFeatured}
          navigation={navigation}
          onPressVerTodos={() => navigation.navigate('FeaturedList')} 
        />
        <CarouselSection
          title="Próximos Lançamentos"
          data={upcomingMovies}
          loading={loadingUpcoming}
          navigation={navigation}
          onPressVerTodos={() => navigation.navigate('UpcomingList')}
        />
        <CarouselSection
          title="Mais Bem Avaliados"
          data={topRatedMovies}
          loading={loadingTopRated}
          navigation={navigation}
          onPressVerTodos={() => navigation.navigate('TopRatedList')}
        />
      </ScrollView>
      <BottomNavigation navigation={navigation} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    bottomNavItem: {
      alignItems: 'center',
    },
    bottomNavLabel: {
      fontSize: 10,
      marginTop: 2,
    },
});  

const carouselStyles = StyleSheet.create({
  container: { marginVertical: 10 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5, 
    paddingHorizontal: 10 
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  verTodos: { fontSize: 14 },
  carouselContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  arrowButton: { paddingHorizontal: 5 },
  movieItem: { 
    marginRight: 10, 
    alignItems: 'center', 
    width: 100 
  },
  poster: { width: 100, height: 150, borderRadius: 5 },
  movieTitle: { 
    marginTop: 5, 
    fontSize: 12, 
    textAlign: 'center' 
  },
});

export default Home;
