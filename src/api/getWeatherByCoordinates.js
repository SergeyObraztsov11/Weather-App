import { config } from "../config.js";

function buildUrl(latitude, longitude, days) {
    const url = new URL("/v1/forecast", config.forecastBaseUrl);
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min,precipitation_sum",
    );
    url.searchParams.set("forecast_days", String(days));
    url.searchParams.set("timezone", "auto");
    return url;
}

export async function getWeatherByCoordinates(latitude, longitude, days) {
    const url = buildUrl(latitude, longitude, days);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
        const response = await fetch(url.href, { signal: controller.signal });
        const data = await response.json();
        const daily = data.daily;

        return daily.time.map((time, index) => ({
            date: time,
            maxTemperature: daily.temperature_2m_max[index],
            minTemperature: daily.temperature_2m_min[index],
            precipitation: daily.precipitation_sum[index],
        }));
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Weather forecast timeout");
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}
