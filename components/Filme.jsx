import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { API_KEY } from "@env";

const API_URL = "https://api.themoviedb.org/3/movie";

const Filme = ({ route }) => {
  const { movieId } = route.params;
  const [filme, setFilme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const response = await axios.get(`${API_URL}/${movieId}?api_key=${API_KEY}&language=pt-BR`);
        setFilme(response.data);
      } catch (err) {
        setError("Erro ao carregar detalhes do filme.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    buscarDetalhes();
  }, [movieId]);

  if (loading) return <ActivityIndicator size="large" color="#1E90FF" style={styles.loading} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${filme.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.header}>
        <Text style={styles.titulo}>{filme.title}</Text>
        <Text style={styles.data}>Lançamento: {filme.release_date}</Text>
        <Text style={styles.avaliacao}>Avaliação: {filme.vote_average} / 10</Text>
      </View>
      <Text style={styles.sinopse}>{filme.overview || "Sem descrição disponível."}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loading: { marginTop: 20 },
  error: { color: "red", textAlign: "center", marginVertical: 20 },
  poster: { width: "100%", height: 400, borderRadius: 15, marginBottom: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#333", textAlign: "center" },
  data: { fontSize: 16, color: "gray", marginVertical: 5 },
  avaliacao: { fontSize: 18, color: "#FFD700", marginBottom: 10 },
  sinopse: { fontSize: 16, color: "#555", textAlign: "justify", lineHeight: 22 },
});

export default Filme;
