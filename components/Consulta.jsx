import React, { useState, useContext, useLayoutEffect, useRef } from "react";
import {View, Text, TextInput, Button, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity,} from "react-native";
import axios from "axios";
import { API_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../contexts/ThemeContext";
import Icon from 'react-native-vector-icons/FontAwesome'; 

const API_URL = "https://api.themoviedb.org/3/search/movie";

const Consulta = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  
  const inputRef = useRef(null); 

  const buscarFilmes = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}?api_key=${API_KEY}&query=${query}&language=pt-BR`
      );
      if (response.data.results.length === 0) {
        setError("Nenhum filme encontrado.");
      }
      setFilmes(response.data.results);
    } catch (err) {
      setError("Erro ao buscar filmes. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TextInput
        ref={inputRef} // Aplica a ref aqui
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border, // Alterar a cor da borda conforme o tema
          },
        ]}
        placeholder="Digite o nome do filme"
        placeholderTextColor={theme.colors.placeholder}
        value={query}
        onChangeText={setQuery}
        autoFocus={true} // Garantir que o campo tenha foco inicial, se necessário
      />
      <Button
        title="Buscar"
        onPress={buscarFilmes}
        color={theme.colors.primary} 
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#1E90FF"
          style={styles.loading}
        />
      )}
      {error ? <Text style={[styles.error, { color: theme.colors.error || "#FF6347" }]}>{error}</Text> : null}
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.filme, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate("Filme", { movieId: item.id })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={[styles.titulo, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.data, { color: theme.colors.text }]}>
          Lançamento: {item.release_date || "Data desconhecida"}
        </Text>
        <Text numberOfLines={3} style={[styles.sinopse, { color: theme.colors.text }]}>
          {item.overview || "Sem descrição disponível."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
      data={filmes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={true}
      ListHeaderComponent={renderHeader}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  loading: {
    marginVertical: 20,
  },
  error: {
    textAlign: "center",
    marginVertical: 10,
  },
  filme: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 5,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  data: {
    fontSize: 14,
  },
  sinopse: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default Consulta;
