import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://192.168.1.139:8080";

export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.warn("⚠️ Aucun refresh token disponible.");
      return false;
    }

    console.log("🔄 Tentative de rafraîchissement du token...");

    const response = await fetch(`${SERVER_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("🚨 Erreur lors du rafraîchissement du token.");
      return false;
    }

    const data = await response.json();
    await AsyncStorage.setItem("jwt", data.accessToken);
    await AsyncStorage.setItem("refreshToken", data.refreshToken); // Optionnel si le serveur renvoie un nouveau refreshToken

    console.log("✅ Token rafraîchi avec succès !");
    return true;
  } catch (error) {
    console.error("⚠️ Erreur lors du rafraîchissement du token :", error);
    return false;
  }
};