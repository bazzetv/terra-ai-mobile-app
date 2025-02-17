import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

// Liste des modèles IA disponibles
const models = [
  {
    id: "train",
    name: "Modèle d'Entraînement",
    description: "Entraînez votre propre modèle personnalisé.",
    image: require("../../assets/images/train.png"),
    route: "/training",
  },
  {
    id: "flux1-dev",
    name: "Flux.1 Dev",
    description: "Génération détaillée et avancée.",
    image: require("../../assets/images/flux1.png"),
    route: "/generate/flux1-dev",
  },
  {
    id: "flux1-schnell",
    name: "Flux.1 Schnell",
    description: "Rapide et efficace.",
    image: require("../../assets/images/flux2.png"),
    route: "/generate/flux1-schnell",
  },
  {
    id: "stable-diffuser",
    name: "Stable Diffuser",
    description: "Un modèle Stable Diffusion puissant.",
    image: require("../../assets/images/flux3.png"),
    route: "/generate/stable-diffuser",
  },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [prompt, setPrompt] = useState("");

  // Fonction d'optimisation du prompt (simulée)
  const optimizePrompt = () => {
    setPrompt(prompt + " (Optimisé)");
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Titre */}
      <Text className="text-2xl font-bold text-center mb-4">Générez votre image</Text>

      {/* Zone de Prompt */}
      <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <TextInput
          className="border p-4 h-20 rounded-lg text-lg"
          placeholder="Décrivez votre image..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg shadow-md"
            onPress={optimizePrompt}
          >
            <Text className="text-white font-semibold text-lg">Optimiser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-500 px-6 py-3 rounded-lg shadow-md"
          >
            <Text className="text-white font-semibold text-lg">Générer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Galerie des modèles */}
      <Text className="text-xl font-bold mb-4">Modèles disponibles</Text>
        <FlatList
            data={models}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 10 }} // Ajoute un espace aux extrémités
            renderItem={({ item }) => (
                <TouchableOpacity
                    className="bg-white p-4 rounded-xl shadow-md mx-2"
                    onPress={() => navigation.navigate(item.route)}
                    style={{
                        width: 180, // Ajuste la largeur pour éviter les coupures
                        marginHorizontal: 10, // Ajoute de l’espace entre les cartes
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3, // Android shadow
                    }}
                >
                    <Image source={item.image} className="w-full h-40 rounded-md mb-2" />
                    <Text className="text-lg font-semibold">{item.name}</Text>
                    <Text className="text-gray-600 text-sm">{item.description}</Text>
                </TouchableOpacity>
            )}
        />
    </View>
  );
}