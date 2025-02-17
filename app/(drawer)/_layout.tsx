import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import HomeScreen from './home';
import TrainingScreen from './training';
import HistoryScreen from './history';
import { useRouter } from 'expo-router';
import { AnimatedFAB } from 'react-native-paper';
import {useState} from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";


const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

    // Gérer la visibilité en fonction du scroll
    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrolling = event.nativeEvent.contentOffset.y;
        setIsVisible(scrolling < 50); // Cache le bouton après 50px de scroll
    };

    return (
        <View style={{ flex: 1 }}>
            <Drawer.Navigator>
                <Drawer.Screen name="home" component={HomeScreen} options={{ title: "Accueil" }} />
                <Drawer.Screen name="training" component={TrainingScreen} options={{ title: "Entraînement" }} />
                <Drawer.Screen name="history" component={HistoryScreen} options={{ title: "Historique" }} />
            </Drawer.Navigator>

            {/* Animated FAB */}
            <AnimatedFAB
                icon="history"
                label="Historique"
                visible={isVisible}
                onPress={() => router.push("/(drawer)/history")}
                style={styles.fab}
            />
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