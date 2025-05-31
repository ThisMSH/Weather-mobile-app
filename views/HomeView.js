import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { weatherApi, getWeatherIcon } from "../services/WeatherApi";

export default function HomeScreen() {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState("El Jadida");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadWeatherData(city);
    }, [city]);

    const loadWeatherData = async (c) => {
        try {
            setLoading(true);
            setError(null);

            const weatherData = await weatherApi.getCurrentWeather(c);
            const forecastData = await weatherApi.getForecast(c);

            setCurrentWeather(weatherData);
            setForecast(forecastData);
        } catch (error) {
            setError(error.message);
            Alert.alert("Error", "Failed to load weather data.");
        } finally {
            setLoading(false);
        }
    };

    const refreshWeatherData = () => {
        loadWeatherData();
    };

    // const fetchNewWeatherData = () => {
    //     console.log("searchQuery: ", searchQuery);
    //     setCity(searchQuery.trim());
    //     loadWeatherData();
    // }

    const submitSearch = () => {
        setCity(searchQuery.trim());
    }

    const clearSearch = () => {
        setSearchQuery("");
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="cloud-offline" size={64} color="#999" />
                <Text style={styles.errorText}>Failed to load weather</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={refreshWeatherData}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Set a city */}
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
                        onSubmitEditing={submitSearch}
                        returnKeyType="search"
                    />
                    {city.length > 0 && (
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
                    onPress={submitSearch}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.searchButtonText}>Set</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Current Weather Card */}
            <View style={styles.currentWeatherCard}>
                <View style={styles.locationHeader}>
                    <Ionicons name="location-outline" size={20} color="#666" />
                    <Text style={styles.cityName}>
                        {currentWeather.city}, {currentWeather.country}
                    </Text>
                </View>

                <View style={styles.temperatureSection}>
                    <Text style={styles.temperature}>
                        {currentWeather.temperature}°
                    </Text>
                    <Ionicons
                        name={getWeatherIcon(currentWeather.condition)}
                        size={80}
                        color="#FFA500"
                    />
                </View>

                <Text style={styles.condition}>{currentWeather.condition}</Text>
                <Text style={styles.description}>
                    {currentWeather.description}
                </Text>
                <Text style={styles.feelsLike}>
                    Feels like {currentWeather.feelsLike}°
                </Text>

                {/* Refresh Button */}
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={refreshWeatherData}
                >
                    <Ionicons name="refresh" size={20} color="#4A90E2" />
                </TouchableOpacity>
            </View>

            {/* Weather Details Card */}
            <View style={styles.detailsCard}>
                <Text style={styles.cardTitle}>Weather Details</Text>

                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Ionicons
                            name="water-outline"
                            size={24}
                            color="#4A90E2"
                        />
                        <Text style={styles.detailLabel}>Humidity</Text>
                        <Text style={styles.detailValue}>
                            {currentWeather.humidity}%
                        </Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Ionicons
                            name="speedometer-outline"
                            size={24}
                            color="#4A90E2"
                        />
                        <Text style={styles.detailLabel}>Wind Speed</Text>
                        <Text style={styles.detailValue}>
                            {currentWeather.windSpeed} km/h
                        </Text>
                    </View>
                </View>
            </View>

            {/* Weekly Forecast Card */}
            <View style={styles.forecastCard}>
                <Text style={styles.cardTitle}>5-Day Forecast</Text>

                {forecast.map((day, index) => (
                    <TouchableOpacity key={index} style={styles.forecastItem}>
                        <Text style={styles.dayText}>{day.day}</Text>
                        <Ionicons
                            name={getWeatherIcon(day.condition)}
                            size={24}
                            color="#FFA500"
                        />
                        <View style={styles.tempRange}>
                            <Text style={styles.highTemp}>{day.high}°</Text>
                            <Text style={styles.lowTemp}>{day.low}°</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fa",
        padding: 16,
    },
    currentWeatherCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    locationHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    cityName: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 8,
        color: "#333",
    },
    temperatureSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    temperature: {
        fontSize: 64,
        fontWeight: "300",
        color: "#333",
        marginRight: 20,
    },
    condition: {
        fontSize: 18,
        color: "#666",
        marginBottom: 4,
    },
    feelsLike: {
        fontSize: 14,
        color: "#999",
    },
    detailsCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        color: "#333",
    },
    detailsGrid: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    detailItem: {
        alignItems: "center",
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#666",
        marginTop: 8,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    forecastCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    forecastItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    dayText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    tempRange: {
        flexDirection: "row",
        alignItems: "center",
        minWidth: 60,
    },
    highTemp: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginRight: 8,
    },
    lowTemp: {
        fontSize: 16,
        color: "#999",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        color: "#666",
        textAlign: "center",
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: "#4A90E2",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    description: {
        fontSize: 14,
        color: "#666",
        textTransform: "capitalize",
        marginBottom: 4,
    },
    refreshButton: {
        position: "absolute",
        top: 16,
        right: 16,
        padding: 8,
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
});
