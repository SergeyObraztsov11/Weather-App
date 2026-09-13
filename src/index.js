import { parseArgs } from "./cli/parseArgs.js";
import { getWeather } from "./services/getWeather.js";

try {
    const options = parseArgs(process.argv);
    const weather = await getWeather(options.cityNames, options.days);
    console.log(weather);
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
