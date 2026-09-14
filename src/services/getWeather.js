import { getCityCoordinates } from "../api/getCityCoordinates.js";
import { getWeatherByCoordinates } from "../api/getWeatherByCoordinates.js";
import { readReport } from "../storage/readReport.js";
import { saveReport } from "../storage/saveReport.js";

async function getWeatherForCity(cityName, days, noCache) {
    // Если кеш не отключен, то проверяем, есть ли данные в кеше и подходят ли они по дням
    if (!noCache) {
        const cached = await readReport(cityName);
        if (cached && cached.weather.length >= days) {
            return {
                ...cached,
                weather: cached.weather.slice(0, days),
                fromCache: true,
            };
        }
    }
    const data = await getCityCoordinates(cityName);
    const weather = await getWeatherByCoordinates(
        data.latitude,
        data.longitude,
        days,
    );
    const report = {
        cityName: data.name,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        weather,
    };
    await saveReport(report, cityName);
    return {
        ...report,
        fromCache: false,
    };
}

export async function getWeather(cityNames = [], days = 3, noCache = false) {
    const results = await Promise.allSettled(
        cityNames.map((cityName) => getWeatherForCity(cityName, days, noCache)),
    );
    return results.map((result, index) => {
        if (result.status === "fulfilled") {
            return { status: "ok", data: result.value };
        }

        return {
            status: "error",
            cityName: cityNames[index],
            errorMessage: result.reason.message,
        };
    });
}
