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

    const hasErrors = citiesWeather.some((item) => item.status === "error");
    process.exit(hasErrors ? 1 : 0);
} catch (error) {
    console.error(`\x1b[31m${error.message}\x1b[0m`);
    process.exit(1);
}
