import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://192.168.1.139:8080";
const Logo = require("../../assets/images/logo.png");

export default function Login() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);

  useEffect(() => {
    const checkAppleAuth = async () => {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAppleAvailable(available);
    };
    checkAppleAuth();
  }, []);

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
        scheme: "terraai",
        preferLocalhost: false,
      });

      console.log(`🔗 Redirect URI utilisée : ${redirectUri}`);

      const authUrl = `${SERVER_URL}/auth/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success") {
        const params = new URLSearchParams(result.url.split("?")[1]);
        const jwt = params.get("token");
        const refreshToken = params.get("refreshToken");

        if (jwt && refreshToken) {
          await AsyncStorage.setItem("jwt", jwt);
          await AsyncStorage.setItem("refreshToken", refreshToken);
          console.log("🔐 Tokens stockés !");
          Alert.alert("Connexion réussie !");
          setIsLoggedIn(true);
          router.replace("/home");
        } else {
          Alert.alert("⚠️ Erreur : Tokens non reçus.");
        }
      }
    } catch (error) {
      console.error("❌ Erreur d'authentification :", error);
      Alert.alert("Erreur lors de la connexion.");
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("🍏 Identifiants Apple :", credential);

      const response = await fetch(`${SERVER_URL}/auth/apple-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appleId: credential.user,
          identityToken: credential.identityToken,
          email: credential.email,
          fullName: credential.fullName 
            ? `${credential.fullName.givenName} ${credential.fullName.familyName}` 
            : null,
        }),
      });

      console.log("🔗 Réponse du serveur :", response);
      if (response.ok) {
        const data = await response.json();
        const { token, refreshToken } = data;

        await AsyncStorage.setItem("jwt", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);

        console.log("🍏 Connexion Apple réussie !");
        setIsLoggedIn(true);
        router.replace("/home");
      } else {
        Alert.alert("⚠️ Erreur : Impossible de se connecter avec Apple.");
      }
    } catch (error) {
      console.error("❌ Erreur de connexion avec Apple :", error);
      Alert.alert("Erreur lors de la connexion avec Apple.");
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

          {/* Bouton Apple */}
          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={{ marginTop: 16, width: "100%", height: 44 }}
              onPress={handleAppleLogin}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}