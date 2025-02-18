import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import modelMock from "../../assets/mock/modelMock.json";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

type Model = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  route: string;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [prompt, setPrompt] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      setModels(modelMock.models);
    } catch (error) {
      console.error("Erreur lors du chargement des modèles :", error);
    }
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Zone de Prompt */}
      <View style={styles.promptContainer}>
        <TextInput
          style={styles.promptInput}
          placeholder="Décrivez votre image..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity 
          style={styles.optimizeButton}
          disabled={true}
          onPress={() => setPrompt(prompt + " (Optimisé)")}>
            <Text style={styles.disabledButton}>Optimiser</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.generateButton, !selectedModel && styles.disabledButton]}
            disabled={!selectedModel}
          >
            <Text style={styles.buttonText}>Générer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Galerie des modèles */}
      <Text style={styles.sectionTitle}>Modèles disponibles</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={models}
          keyExtractor={(item) => item.id}
          numColumns={2} // ✅ Deux colonnes comme dans HistoryScreen
          contentContainerStyle={styles.gridContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                selectedModel?.id === item.id && styles.selectedCard && { backgroundColor: "#E8F0FE" }, 
              ]}
              onPress={() => setSelectedModel(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
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
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 10,
  },
  promptContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  promptInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    height: 80,
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  optimizeButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  generateButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "blue",
    backgroundColor: "#E8F0FE",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 150, // ✅ Taille similaire aux images dans HistoryScreen
    resizeMode: "cover",
  },
  cardTextContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
});