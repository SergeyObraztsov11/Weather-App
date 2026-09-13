import { config } from "../config.js";

function buildUrl(city) {
  const url = new URL("/v1/search", config.geocodingBaseUrl);
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "ru");
  url.searchParams.set("format", "json");
  return url;
}

export async function getCityCoordinates(city) {
  const url = buildUrl(city);

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, config.timeoutMs);

  try {
    const response = await fetch(url.href, { signal: controller.signal });
    const data = await response.json();
    const result = data.results?.[0];

    if (!result) {
      throw new Error(`City ${city} not found`);
    }

    return {
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Geocoding timeout for "${city}"`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
