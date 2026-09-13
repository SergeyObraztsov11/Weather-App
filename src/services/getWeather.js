import { getCityCoordinates } from "../api/getCityCoordinates.js";
import { getWeatherByCoordinates } from "../api/getWeatherByCoordinates.js";
import { readReport } from "../storage/readReport.js";
import { saveReport } from "../storage/saveReport.js";

async function getWeatherForCity(cityName, days, noCache) {
    if (!noCache) {
        const cached = await readReport(cityName);
        if (cached) {
            return cached;
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
    await saveReport(report);
    return report;
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
