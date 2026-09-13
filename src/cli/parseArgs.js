export function parseArgs(argv) {
    const args = argv.slice(2);

    const result = {
        cities: [],
        days: 3,
        noCache: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === "--city") {
            const value = args[i + 1];
            if (!value || value.startsWith("--")) {
                throw new Error("Missing value for --city");
            }
            result.cities = value
                .split(",")
                .map((city) => city.trim())
                .filter(Boolean);
            i += 1;
            continue;
        }

        if (arg === "--days") {
            const value = args[i + 1];
            if (!value || value.startsWith("--")) {
                throw new Error("Missing value for --days");
            }
            const days = Number(value);
            if (!Number.isInteger(days) || days < 1 || days > 7) {
                throw new Error(
                    "Argument --days must be an integer from 1 to 7",
                );
            }
            result.days = days;
            i += 1;
            continue;
        }

        if (arg === "--no-cache") {
            result.noCache = true;
            continue;
        }

        if (arg.startsWith("--")) {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    if (result.cities.length === 0) {
        throw new Error('Missing required argument: --city "Moscow, Kazan"');
    }

    return result;
}
