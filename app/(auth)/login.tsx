import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://192.168.1.139:8080";
const Logo = require("../../assets/images/logo.png");

export default function Login() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token) {
          console.log("✅ JWT trouvé, connexion automatique !");
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erreur de récupération du JWT :", error);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "terraai", // ✅ Schéma défini pour Expo
        preferLocalhost: false,
      });

      console.log(`🔗 Redirect URI utilisée : ${redirectUri}`);

      // 🔹 Redirection vers le backend (BFF)
      const authUrl = `${SERVER_URL}/auth/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success") {
        const jwt = result.url.split("token=")[1]; // Récupération du JWT dans l'URL
        if (jwt) {
          await AsyncStorage.setItem("jwt", jwt);
          console.log("🔐 Token JWT stocké !");
          Alert.alert("Connexion réussie !");
          setIsLoggedIn(true);
          router.replace("/home");
        } else {
          Alert.alert("⚠️ Erreur : Aucun token reçu.");
        }
      }
    } catch (error) {
      console.error("❌ Erreur d'authentification :", error);
      Alert.alert("Erreur lors de la connexion.");
    }
  };

  // ✅ Déconnexion (Suppression du JWT)
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwt"); // Supprime le JWT stocké
      setIsLoggedIn(false);
      Alert.alert("Déconnexion réussie !");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion :", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#1e3a8a", "#2563eb", "#7e22ce"]}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          overflow: "hidden",
        }}
      >
        <View className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
          <Image source={Logo} className="w-24 h-24 mx-auto mb-4" resizeMode="contain" />
          <Text className="text-gray-900 text-3xl font-extrabold text-center mb-2">
            Bienvenue sur <Text className="text-blue-600">Terra AI</Text>
          </Text>
          <Text className="text-gray-600 text-lg text-center mb-6">
            Générez des images optimisées pour vos miniatures YouTube !
          </Text>

          {/* Bouton Google */}
          <TouchableOpacity
            className="flex-row items-center bg-white py-3 px-6 rounded-full shadow-lg border border-gray-300"
            onPress={handleGoogleLogin}
          >
            <AntDesign name="google" size={24} color="black" className="mr-3" />
            <Text className="text-black font-medium text-lg">Se connecter avec Google</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}