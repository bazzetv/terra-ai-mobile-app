import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import HomeScreen from './home';
import TrainingScreen from './training';
import HistoryScreen from './history';
import { useRouter, usePathname } from 'expo-router';
import { useState } from "react";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();
    return (
        <View style={{ flex: 1 }}>
            <Drawer.Navigator>
                <Drawer.Screen name="home" component={HomeScreen} options={{
                    title: "Générez votre image",
                    headerTitleStyle: { fontWeight: "bold" }
                }}   />
                <Drawer.Screen name="training" component={TrainingScreen} options={{
                    title: "Entrainez votre model",
                    headerTitleStyle: { fontWeight: "bold" }
                }}  />
                <Drawer.Screen name="history" component={HistoryScreen} options={{
                    title: "Historique de génération",
                    headerTitleStyle: { fontWeight: "bold" }
                }} />
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
        borderRadius: 50, // Rend le bouton plus rond
        paddingHorizontal: 10, // Ajuste la taille interne
        shadowColor: '#000', // Ombre
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, // Ombre sur Android
    },
});