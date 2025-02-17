import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Logo = require("../../assets/images/logo.png");

export default function Login() {
  return (
      <SafeAreaView className="flex-1">
        {/* Fond dégradé avec arrondi en haut */}
        <LinearGradient
            colors={["#1e3a8a", "#2563eb", "#7e22ce"]}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 24,
              marginTop: 20, // ✅ Ajout d’un léger espace en haut
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              overflow: "hidden",
            }}
        >
          {/* Effet de flou en arrière-plan */}
          <View className="absolute w-full h-full bg-white opacity-10 blur-lg" />

          {/* Conteneur principal avec effet carte */}
          <View className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
            {/* Logo Terra AI */}
            <Image source={Logo} className="w-24 h-24 mx-auto mb-4" resizeMode="contain" />

            {/* Titre et description */}
            <Text className="text-gray-900 text-3xl font-extrabold text-center mb-2">
              Bienvenue sur <Text className="text-blue-600">Terra AI</Text>
            </Text>
            <Text className="text-gray-600 text-lg text-center mb-6">
              Générez des images optimisées pour vos miniatures YouTube !
            </Text>

            {/* Bouton Google avec animation */}
            <TouchableOpacity className="flex-row items-center bg-white py-3 px-6 rounded-full shadow-lg mb-4 border border-gray-300 active:bg-gray-200 transition-all">
              <AntDesign name="google" size={24} color="black" className="mr-3" />
              <Text className="text-black font-medium text-lg">
                Se connecter avec Google
              </Text>
            </TouchableOpacity>

            {/* Lien d'inscription */}
            <TouchableOpacity>
              <Text className="text-blue-500 text-sm underline text-center">
                Créer un compte
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
  );
}