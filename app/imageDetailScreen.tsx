import { View, Image, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import React from "react";

export default function ImageDetailScreen() {
  const router = useRouter();
  const { url, prompt, date } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const shareImage = async () => {
    if (!url) {
      alert("Aucune image à partager !");
      return;
    }
    try {
      await Share.share({
        message: `Découvrez cette image : ${url}`,
        url: url as string,
        title: "Image Générée",
      });
    } catch (error) {
      console.error("Erreur lors du partage", error);
    }
  };

  const downloadImage = async () => {
    if (!hasPermission) {
      alert("Permission de stockage requise !");
      return;
    }
    if (!url) {
      alert("Aucune image à télécharger !");
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + "image.jpg";
      const { uri } = await FileSystem.downloadAsync(url as string, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      alert("Image enregistrée dans votre galerie !");
    } catch (error) {
      console.error("Erreur lors du téléchargement", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {url ? (
        <Image source={{ uri: url as string }} style={styles.image} />
      ) : (
        <Text style={{ color: "white", fontSize: 18 }}>Aucune image disponible</Text>
      )}

      <View style={styles.details}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.prompt}>{prompt}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={shareImage}>
          <Ionicons name="share-social" size={24} color="white" />
          <Text style={styles.actionText}>Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={downloadImage}>
          <Ionicons name="download" size={24} color="white" />
          <Text style={styles.actionText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 50,
  },
  image: {
    width: "100%",
    height: "70%",
    resizeMode: "contain",
  },
  details: {
    alignItems: "center",
    marginTop: 10,
  },
  prompt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ea",
    padding: 12,
    borderRadius: 10,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});