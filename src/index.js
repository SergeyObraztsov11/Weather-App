import { parseArgs } from "./cli/parseArgs.js";
import { getWeather } from "./services/getWeather.js";
import { printWeather } from "./format/printWeather.js";

try {
    const options = parseArgs(process.argv);
    const citiesWeather = await getWeather(
        options.cityNames,
        options.days,
        options.noCache,
    );
    printWeather(citiesWeather);
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
