const red = "\x1b[31m";
const reset = "\x1b[0m";

export function printWeather(citiesWeather) {
    for (const cityWeather of citiesWeather) {
        if (cityWeather.status === "error") {
            console.error(`${red}Error: ${cityWeather.errorMessage}${reset}`);
            continue;
        }

        const {
            cityName,
            country,
            latitude,
            longitude,
            weather,
            fromCache,
        } = cityWeather.data;

        const source = fromCache ? "cache" : "network";

        console.log("");
        console.log(
            `${cityName}, ${country} (${latitude}, ${longitude}) (${source})`,
        );
        console.log(" # | Date       | Max °C  | Min °C | Precipitation mm");
        console.log("---|------------|---------|--------|------------------");

        for (let i = 0; i < weather.length; i++) {
            const day = weather[i];
            const num = String(i + 1).padEnd(2);
            const date = day.date.padEnd(10);
            const max = String(day.maxTemperature).padEnd(7);
            const min = String(day.minTemperature).padEnd(6);
            const rain = String(day.precipitation).padEnd(16);
            console.log(` ${num}| ${date} | ${max} | ${min} | ${rain}`);
        }

        console.log("");
    }
}
