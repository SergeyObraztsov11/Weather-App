import { parseArgs } from "./cli/parseArgs.js";
import { getCityCoordinates } from "./api/getCityCoordinates.js";
import { getWeatherByCoordinates } from "./api/getWeatherByCoordinates.js";

try {
    const options = parseArgs(process.argv);
    const cityCoordinates = await getCityCoordinates(options.cities[0]);
    const cityWeather = await getWeatherByCoordinates(
        cityCoordinates.latitude,
        cityCoordinates.longitude,
        options.days,
    );
    console.log(cityWeather);
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
