import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeView from "./views/HomeView";
import SearchView from "./views/SearchView";
import DetailsView from "./views/DetailsView";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === "Home") {
                            iconName = focused ? "home" : "home-outline";
                        } else if (route.name === "Search") {
                            iconName = focused ? "search" : "search-outline";
                        } else if (route.name === "Details") {
                            iconName = focused ? "list" : "list-outline";
                        }

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarActiveTintColor: "#007AFF",
                    tabBarInactiveTintColor: "gray",
                    tabBarStyle: {
                        height: 52
                    },
                    headerStyle: {
                        backgroundColor: "#007AFF",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeView}
                    options={{ title: "Weather Home" }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchView}
                    options={{ title: "Search Cities" }}
                />
                <Tab.Screen
                    name="Details"
                    component={DetailsView}
                    options={{ title: "Weather Details" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

