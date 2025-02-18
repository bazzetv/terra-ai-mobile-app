import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";
import historyMock from "../../assets/mock/historyMock.json";
import { useRef } from "react";

type ImageData = {
  id: string;
  user_id: string;
  prompt: string;
  status: "pending" | "completed";
  created_at: string;
  updated_at: string;
  url: string | null;
};



// ✅ Fonction pour afficher "Aujourd'hui", "Hier", "il y a X jours"
const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffTime === 0) return "Aujourd’hui";
  if (diffTime === 1) return "Hier";
  return `Il y a ${diffTime} jours`;
};

export default function HistoryScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const previousImages = useRef([]);

  useEffect(() => {
    const fetchHistory = async () => {
      // Charger immédiatement les images
      const newImages = historyMock.images;

      if (JSON.stringify(newImages) !== JSON.stringify(previousImages.current)) {
        setImages(newImages);
        previousImages.current = newImages; // Mise à jour de la ref
      }

      setLoading(false);
  
      // Rafraîchir après 10 secondes
      setTimeout(() => {
        setImages(historyMock.images);
      }, 1000);
    };
  
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
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
                    date: formatRelativeDate(item.updated_at),
                  },
                });
              }, 100); // Petit délai pour laisser les données être prêtes
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
              {item.status === "completed" ? (
                <Text style={styles.date}>🟣 {formatRelativeDate(item.updated_at)}</Text>
              ) : (
                <Text style={styles.pendingText}>⏳ Génération...</Text>
              )}
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
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