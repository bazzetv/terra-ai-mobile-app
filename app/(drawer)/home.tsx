import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  Image, ActivityIndicator, StyleSheet, Alert 
} from "react-native";
import { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { refreshToken } from "../utils/auth";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

type Model = {
  name: string;
  description: string;
  imageUrl: string;
  route: string;
};

const SERVER_URL = "http://localhost:8080/private";

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [prompt, setPrompt] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [numImages, setNumImages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        let token = await AsyncStorage.getItem("jwt");
        if (!token) {
          console.warn("🚫 Aucun JWT trouvé, impossible de charger les modèles.");
          setLoading(false);
          return;
        }
  
        let response = await fetch(`${SERVER_URL}/models`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response retourné par models", response);

        if (response.status === 401) {
          console.log("🔄 Token expiré, tentative de rafraîchissement...");
          const refreshed = await refreshToken();
          if (refreshed) {
            token = await AsyncStorage.getItem("jwt");
            response = await fetch(`${SERVER_URL}/models`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
  
        if (!response.ok) {
          throw new Error("Impossible de récupérer les modèles.");
        }
  
        const modelList: Model[] = await response.json();
        setModels(modelList);
  
        if (modelList.length > 0) {
          setSelectedModel(modelList[0]);
          console.log(`✅ Modèle sélectionné par défaut : ${modelList[0].name}`);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des modèles :", error);
        Alert.alert("Erreur", "Impossible de charger les modèles disponibles.");
      }
      setLoading(false);
    };
  
    loadModels();
  }, []);

  const handleGenerate = async () => {
    if (!selectedModel || prompt.trim() === "") {
      Alert.alert("Erreur", "Veuillez sélectionner un modèle et entrer un prompt.");
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("jwt");
      const response = await fetch(`${SERVER_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel.name,
          numImages: numImages,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const requestId = data.request_id;
        console.log("� requestId dans Home :", requestId);
        navigation.navigate("history", { requestId });
      } else {
        Alert.alert("Erreur", "Impossible de lancer la génération.");
      }
    } catch (error) {
      console.error("Erreur de génération :", error);
      Alert.alert("Erreur", "Un problème est survenu.");
    }
  };

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

        {/* Slider pour choisir le nombre d'images */}
        <View style={styles.sliderContainer}>
          <Text>Nombre d'images: {numImages}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={3}
            step={1}
            value={numImages}
            onValueChange={setNumImages}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.generateButton, !selectedModel && styles.disabledButton]}
            disabled={!selectedModel}
            onPress={handleGenerate}
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
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                selectedModel?.name === item.name && styles.selectedCard,
              ]}
              onPress={() => setSelectedModel(item)}
            >
              <Image source={{ uri: `http://192.168.1.139:9000${item.imageUrl}` }} style={styles.image} />
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
  sliderContainer: {
    marginVertical: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
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
    height: 150,
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