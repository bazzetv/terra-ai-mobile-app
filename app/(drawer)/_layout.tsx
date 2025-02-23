import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import HomeScreen from './home';
import TrainingScreen from './training';
import HistoryScreen from './history';
import { useRouter, usePathname } from 'expo-router';
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const router = useRouter(); // ✅ Utilisation de `useRouter()` pour la navigation

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("jwt"); 
            await AsyncStorage.removeItem("refreshToken");
            await AsyncStorage.setItem("wasLoggedOut", "true");
            router.replace("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return (
        <DrawerContentScrollView {...props}>
            {/* ✅ Affichage des éléments du menu */}
            <DrawerItemList {...props} />

            {/* ✅ Ajout du bouton de déconnexion */}
            <DrawerItem
                label="Se déconnecter"
                onPress={handleLogout}
                labelStyle={{ color: "red", fontWeight: "bold" }}
            />
        </DrawerContentScrollView>
    );
}

export default function DrawerLayout() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();

    return (
        <View style={{ flex: 1 }}>
            <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="home" component={HomeScreen} options={{
                    title: "Générez votre image",
                    headerTitleStyle: { fontWeight: "bold" }
                }} />
                <Drawer.Screen name="training" component={TrainingScreen} options={{
                    title: "Entrainez votre model",
                    headerTitleStyle: { fontWeight: "bold" }
                }} />
                <Drawer.Screen
                    name="history"
                    component={HistoryScreen}
                    options={{ title: "Historique de génération" }}
                />
            </Drawer.Navigator>
            {pathname !== "/history" && (
                <AnimatedFAB
                    icon="history"
                    label="Historique"
                    visible={isVisible}
                    onPress={() => router.push("/(drawer)/history")}
                    style={styles.fab}
                    extended={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#6200ea',
        borderRadius: 50, 
        paddingHorizontal: 10,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, 
    },
});