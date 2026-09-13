export const config = {
    timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS) || 5000,
    reportsDir: process.env.REPORTS_DIR || 'reports',
    geocodingBaseUrl:
      process.env.GEOCODING_BASE_URL || 'https://geocoding-api.open-meteo.com',
    forecastBaseUrl:
      process.env.FORECAST_BASE_URL || 'https://api.open-meteo.com',
  };