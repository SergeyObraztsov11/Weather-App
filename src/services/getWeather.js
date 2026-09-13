import { getCityCoordinates } from "../api/getCityCoordinates.js";
import { getWeatherByCoordinates } from "../api/getWeatherByCoordinates.js";

async function getWeatherForCity(city, days) {
    const data = await getCityCoordinates(city);
    const weather = await getWeatherByCoordinates(
        data.latitude,
        data.longitude,
        days,
    );
    return {
        city: data.name,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        weather,
    };
}

export async function getWeather(cityNames = [], days = 3) {
    const results = await Promise.allSettled(
        cityNames.map((name) => getWeatherForCity(name, days)),
    );
    return results.map((result, index) => {
        if (result.status === "fulfilled") {
            return { status: "ok", data: result.value };
        }

        return {
            status: "error",
            city: cityNames[index],
            errorMessage: result.reason.message,
        };
    });
}
