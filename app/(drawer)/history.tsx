import { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
const SERVER_URL = "http://192.168.1.139:8080/private";

type ImageData = {
  id: string;
  request_id: string;
  prompt: string;
  status: "pending" | "uploaded";
  created_at: string;
  url: string | null;
};

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffTime === 0) return "Aujourd’hui";
  if (diffTime === 1) return "Hier";
  return `Il y a ${diffTime} jours`;
};


export default function HistoryScreen({ route }) {
  const { requestId } = route.params || {}; // ✅ Récupération propre
  console.log("📥 Paramètres reçus dans HistoryScreen :", requestId);

  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const prevImagesRef = useRef<ImageData[]>([]); // ✅ Stocke l'ancien état
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      let interval: NodeJS.Timeout | null = null;

      const fetchHistory = async () => {
        try {
          const token = await AsyncStorage.getItem("jwt");
          if (!token) return;

          const endpoint = requestId
            ? `${SERVER_URL}/history?requestId=${requestId}`
            : `${SERVER_URL}/history`;
          console.log(`🔗 Chargement de l'historique depuis : ${endpoint}`);

          const response = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            const newImages = Array.isArray(data) ? data : data.images ?? [];

            if (JSON.stringify(newImages) !== JSON.stringify(prevImagesRef.current)) {
              console.log("🔄 Mise à jour des images !");
              setImages(newImages);
              prevImagesRef.current = newImages; // ✅ Met à jour la référence
              
            } else {
              console.log("✅ Les données sont identiques, pas de mise à jour.");
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement des images :", error);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
      interval = setInterval(fetchHistory, 10000); // 🔄 Polling actif seulement si l'écran est focus

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [requestId])
  );

  const doneImages = images.filter((img) => img.status === "uploaded");
  const pendingImages = images.filter((img) => img.status === "pending");

  return (
    <View style={styles.container}>
      {requestId && (
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.replace("/history")}
        >
          <Text style={styles.historyButtonText}>📜 Voir tout l'historique</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="blue" style={{ marginBottom: 20 }} />}

      {/* ✅ Toujours afficher la FlatList */}
      {images.length === 0 ? (
        <Text style={styles.noImagesText}>Aucune image générée pour l’instant.</Text>
      ) : (
        <FlatList
          data={[...pendingImages, ...doneImages]} // 🔹 D'abord "pending", ensuite "done"
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }: { item: ImageData }) => (
            <TouchableOpacity
              disabled={item.status === "pending"}
              style={{ flex: 1, margin: 5 }}
              onPress={() => {
                setTimeout(() => {
                  router.push({
                    pathname: "/imageDetailScreen",
                    params: {
                      url: item.url,
                      prompt: item.prompt,
                      date: formatRelativeDate(item.created_at),
                    },
                  });
                }, 100);
              }}
            >
              <Card style={styles.card}>
                <View style={styles.imageContainer}>
                  {item.status === "pending" ? (
                    <>
                      <View style={styles.pendingOverlay} />
                      <ActivityIndicator size="large" color="white" style={styles.loader} />
                    </>
                  ) : (
                    <Image source={{ uri: item.url! }} style={styles.image} />
                  )}
                </View>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.prompt}>
                  {item.prompt}
                </Text>
                <Text style={item.status === "uploaded" ? styles.date : styles.pendingText}>
                  {item.status === "uploaded" ? `🟣 ${formatRelativeDate(item.created_at)}` : "⏳ Génération..."}
                </Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  historyButton: {
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    alignSelf: "center",
  },
  historyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noImagesText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(200, 200, 200, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
  },
  prompt: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "purple",
    marginTop: 3,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF8C00",
    marginTop: 3,
  },
});