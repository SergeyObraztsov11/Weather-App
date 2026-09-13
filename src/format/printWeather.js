export function printWeather(citiesWeather) {
    for (const cityWeather of citiesWeather) {
        if (cityWeather.status === "error") {
            console.error(cityWeather.errorMessage);
            continue;
        }
        const { cityName, country, latitude, longitude, weather } =
            cityWeather.data;
            
        console.log("");
        console.log(`${cityName}, ${country} (${latitude}, ${longitude})`);
        console.log(" # | Дата       | Макс °C | Мин °C | Осадки мм");
        console.log("---|------------|---------|--------|-----------");
        for (let i = 0; i < weather.length; i++) {
            const day = weather[i];
            const num = String(i + 1).padEnd(2);
            const date = day.date.padEnd(10);
            const max = String(day.maxTemperature).padEnd(7);
            const min = String(day.minTemperature).padEnd(6);
            const rain = String(day.precipitation).padEnd(9);
            console.log(` ${num}| ${date} | ${max} | ${min} | ${rain}`);
        }

        console.log("");
    }
}
