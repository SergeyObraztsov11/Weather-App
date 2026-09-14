FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY src ./src

# No production dependencies — app uses only Node built-ins
# CLI args: docker run ... weather-app --city "Moscow" --days 3
# Env vars: docker run --env-file .env ... or -e REQUEST_TIMEOUT_MS=5000

ENTRYPOINT ["node", "src/index.js"]
CMD ["--city", "Moscow", "--days", "3"]
