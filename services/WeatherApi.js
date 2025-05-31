import { API_KEY, API_URL } from "../env";

export const weatherApi = {
    getCurrentWeather: async (city) => {
        try {
            const response = await fetch(
                `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(
                    `Error fetching current weather: ${response.statusText}`
                );
            }

            const data = await response.json();

            return {
                city: data.name,
                coutry: data.sys.country,
                temperature: Math.round(data.main.temp),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                feelsLike: Math.round(data.main.feels_like),
                icon: data.weather[0].icon,
            };
        } catch (error) {
            console.error("Error fetching current weather:", error);
            throw new Error("Failed to fetch current weather data");
        }
    },

    getCurrentWeatherByCoordinates: async (lat, lon) => {
        try {
            const response = await fetch(
                `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(
                    `Error fetching weather by coordinates: ${response.statusText}`
                );
            }

            const data = await response.json();

            return {
                city: data.name,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                feelsLike: Math.round(data.main.feels_like),
                icon: data.weather[0].icon,
            };
        } catch (error) {
            console.error("Error fetching weather by coordinates:", error);
            throw new Error("Failed to fetch weather data by coordinates");
        }
    },

    getForecast: async (city) => {
        try {
            const response = await fetch(
                `${API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(
                    `Error fetching forecast: ${response.statusText}`
                );
            }

            const data = await response.json();
            const dailyForecast = data.list
                .filter(
                    (item, idx) => idx % 8 === 0 // Get one forecast per day (every 8th item)
                )
                .slice(0, 5); // Limit to 5 days

            return dailyForecast.map((item, idx) => {
                const date = new Date(item.dt * 1000);
                const dayName =
                    idx === 0
                        ? "Today"
                        : idx === 1
                        ? "Tomorrow"
                        : date.toLocaleDateString("en-UK", { weekday: "long" });

                return {
                    day: dayName,
                    high: Math.round(item.main.temp_max),
                    low: Math.round(item.main.temp_min),
                    condition: item.weather[0].main,
                    icon: item.weather[0].icon,
                };
            });
        } catch (error) {
            console.error("Error fetching forecast:", error);
            throw new Error("Failed to fetch weather forecast data");
        }
    },
};

export const getWeatherIcon = (condition) => {
    const iconMap = {
        Clear: "sunny",
        Clouds: "cloudy",
        Rain: "rainy",
        Drizzle: "rainy",
        Thunderstorm: "thunderstorm",
        Snow: "snow",
        Fog: "fog",
        Mist: "cloudy",
    };

    return iconMap[condition] || "partly-sunny";
};
