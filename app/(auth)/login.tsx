import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";

const Logo = require("../../assets/images/logo.png");

const BFF_AUTH_URL = "http://localhost:8080/auth/login"; // URL de ton backend

export default function Login() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleGoogleLogin() {
    try {
      const result = await AuthSession.startAsync({
        authUrl: BFF_AUTH_URL,
        returnUrl: AuthSession.makeRedirectUri({ useProxy: true }),
      });

      if (result.type === "success") {
        // Vérifier si la session est active
        const response = await fetch("http://localhost:8080/auth/session", {
          method: "GET",
          credentials: "include", // Important pour garder la session active
        });

        if (response.ok) {
          setIsLoggedIn(true);
          Alert.alert("Connexion réussie !");
          router.replace("/home");
        } else {
          Alert.alert("Erreur de connexion.");
        }
      }
    } catch (error) {
      console.error("Erreur de connexion Google :", error);
      Alert.alert("Erreur de connexion.");
    }
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