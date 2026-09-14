import { config } from "../config.js";

function buildUrl(cityName) {
    const url = new URL("/v1/search", config.geocodingBaseUrl);
    url.searchParams.set("name", cityName);
    url.searchParams.set("count", "1");
    url.searchParams.set("language", "ru");
    url.searchParams.set("format", "json");
    return url;
}

export async function getCityCoordinates(cityName) {
    const url = buildUrl(cityName);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, config.timeoutMs);

    try {
        const response = await fetch(url.href, { signal: controller.signal });

        if (response.status >= 400 && response.status < 500) {
            throw new Error(
                `Geocoding client error (${response.status}) for "${cityName}"`,
            );
        }
        if (response.status >= 500) {
            throw new Error(
                `Geocoding server error (${response.status}) for "${cityName}"`,
            );
        }

        let data;
        try {
            data = await response.json();
        } catch (error) {
            throw new Error(
                `Invalid JSON in geocoding response for "${cityName}"`,
                { cause: error },
            );
        }

        const result = data.results?.[0];
        if (!result) {
            throw new Error(`City ${cityName} not found`);
        }

        return {
            name: result.name,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude,
        };
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(`Geocoding timeout for "${cityName}"`, {
                cause: error,
            });
        }
        if (error.message.includes("fetch failed")) {
            throw new Error(`Network error while geocoding "${cityName}"`, {
                cause: error,
            });
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}
