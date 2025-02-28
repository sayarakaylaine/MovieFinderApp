import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";

const API_URL = "https://api.themoviedb.org/3/search/movie";

const Consulta = () => {
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const buscarFilmes = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}?api_key=${API_KEY}&query=${query}&language=pt-BR`);
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={buscarFilmes} color="#1E90FF" />

      {loading && <ActivityIndicator size="large" color="#1E90FF" style={styles.loading} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.filme}
            onPress={() => navigation.navigate("Filme", { movieId: item.id })}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.poster}
            />
            <View style={styles.info}>
              <Text style={styles.titulo}>{item.title}</Text>
              <Text style={styles.data}>Lançamento: {item.release_date || "Data desconhecida"}</Text>
              <Text numberOfLines={3} style={styles.sinopse}>{item.overview || "Sem descrição disponível."}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" },
  loading: { marginVertical: 20 },
  error: { color: "#FF6347", textAlign: "center", marginVertical: 10 },
  filme: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", borderRadius: 10, marginBottom: 15 },
  poster: { width: 100, height: 150, borderRadius: 5, marginRight: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  info: { flex: 1, justifyContent: "center" },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#333" },
  data: { fontSize: 14, color: "gray" },
  sinopse: { fontSize: 14, color: "#555", marginTop: 5 },
});

export default Consulta;
