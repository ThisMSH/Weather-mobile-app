import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { weatherApi, getWeatherIcon } from "../services/WeatherApi";

export default function SearchScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([
        "El Jadida",
        "Casablanca",
        "Rabat",
        "London",
        "New York",
        "Tokyo",
        "Sydney",
    ]);

    const searchCity = async () => {
        if (!searchQuery.trim()) {
            Alert.alert(
                "Enter City Name",
                "Please enter a city name to search"
            );
            return;
        }

        try {
            setLoading(true);
            const weatherData = await weatherApi.getCurrentWeather(
                searchQuery.trim()
            );

            // Add to recent searches if not already there
            if (!recentSearches.includes(weatherData.city)) {
                setRecentSearches((prev) => [
                    weatherData.city,
                    ...prev.slice(0, 6),
                ]);
            }

            setSearchResults([weatherData]);
        } catch (error) {
            Alert.alert(
                "City Not Found",
                "Please check the city name and try again"
            );
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const searchRecentCity = async (cityName) => {
        try {
            setLoading(true);
            setSearchQuery(cityName);
            const weatherData = await weatherApi.getCurrentWeather(cityName);
            setSearchResults([weatherData]);
        } catch (error) {
            Alert.alert("Error", "Failed to load weather for " + cityName);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
    };

    const renderWeatherResult = ({ item }) => (
        <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
                <View style={styles.locationInfo}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.cityName}>
                        {item.city}, {item.country}
                    </Text>
                </View>
                <View style={styles.temperatureContainer}>
                    <Text style={styles.temperature}>{item.temperature}°</Text>
                    <Ionicons
                        name={getWeatherIcon(item.condition)}
                        size={32}
                        color="#FFA500"
                    />
                </View>
            </View>

            <View style={styles.resultDetails}>
                <Text style={styles.condition}>{item.condition}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>

            <View style={styles.resultStats}>
                <View style={styles.statItem}>
                    <Ionicons name="water-outline" size={16} color="#4A90E2" />
                    <Text style={styles.statText}>{item.humidity}%</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons
                        name="speedometer-outline"
                        size={16}
                        color="#4A90E2"
                    />
                    <Text style={styles.statText}>{item.windSpeed} km/h</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons
                        name="thermometer-outline"
                        size={16}
                        color="#4A90E2"
                    />
                    <Text style={styles.statText}>Feels {item.feelsLike}°</Text>
                </View>
            </View>
        </View>
    );

    const renderRecentCity = ({ item }) => (
        <TouchableOpacity
            style={styles.recentCityItem}
            onPress={() => searchRecentCity(item)}
        >
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.recentCityText}>{item}</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color="#666"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a city..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={searchCity}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={clearSearch}
                            style={styles.clearButton}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={searchCity}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.searchButtonText}>Search</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Search Results</Text>
                    <FlatList
                        data={searchResults}
                        renderItem={renderWeatherResult}
                        keyExtractor={(item, index) => `result-${index}`}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}

            {/* Recent Searches */}
            {searchResults.length === 0 && (
                <View style={styles.recentSection}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <FlatList
                        data={recentSearches}
                        renderItem={renderRecentCity}
                        keyExtractor={(item, index) => `recent-${index}`}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}

            {/* Popular Cities */}
            {searchResults.length === 0 && (
                <View style={styles.popularSection}>
                    <Text style={styles.sectionTitle}>Popular Cities</Text>
                    <View style={styles.popularGrid}>
                        {[
                            "London",
                            "New York",
                            "Tokyo",
                            "El Jadida", // 3lach la
                            "Sydney",
                            "Dubai",
                        ].map((city) => (
                            <TouchableOpacity
                                key={city}
                                style={styles.popularCityItem}
                                onPress={() => searchRecentCity(city)}
                            >
                                <Text style={styles.popularCityText}>
                                    {city}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fa",
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 12,
        paddingHorizontal: 16,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: "#333",
    },
    clearButton: {
        padding: 4,
    },
    searchButton: {
        backgroundColor: "#4A90E2",
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        minWidth: 80,
    },
    searchButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    resultsSection: {
        flex: 1,
    },
    resultCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    resultHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    locationInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    cityName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 8,
    },
    temperatureContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    temperature: {
        fontSize: 32,
        fontWeight: "300",
        color: "#333",
        marginRight: 8,
    },
    resultDetails: {
        marginBottom: 16,
    },
    condition: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: "#666",
        textTransform: "capitalize",
    },
    resultStats: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    statText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    recentSection: {
        marginBottom: 24,
    },
    recentCityItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    recentCityText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        marginLeft: 12,
    },
    popularSection: {
        flex: 1,
    },
    popularGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    popularCityItem: {
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 8,
        width: "48%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    popularCityText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
});
