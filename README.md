# Погодный дайджест (Weather Digest)

## 1. Краткое описание

Консольная утилита на Node.js: получает прогноз погоды для одного или нескольких городов, выводит таблицу в терминал и сохраняет JSON-отчёт на диск. Повторный запуск за тот же день использует кэш (если не указан `--no-cache`).

## 2. Требования к окружению

- Node.js **20+**
- npm

## 3. Установка

```bash
git clone <ссылка-на-репозиторий>
cd "Weather App"
npm install
cp .env.example .env
```

## 4. Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `REQUEST_TIMEOUT_MS` | `5000` | Таймаут запроса в мс |
| `REPORTS_DIR` | `reports` | Папка для JSON-отчётов |
| `GEOCODING_BASE_URL` | `https://geocoding-api.open-meteo.com` | Базовый URL геокодинга |
| `FORECAST_BASE_URL` | `https://api.open-meteo.com` | Базовый URL прогноза |

Образец значений — файл `.env.example`. Файл `.env` в репозиторий не коммитится.

## 5. Команды запуска и параметры

Базовый запуск:

```bash
node --env-file=.env src/index.js --city "Нижний Новгород" --days 3
```

Все параметры:

| Параметр | Обязательный | Описание |
|----------|--------------|----------|
| `--city` | да | Один город или несколько через запятую |
| `--days` | нет | Длина прогноза, целое **1–7**, по умолчанию **3** |
| `--no-cache` | нет | Игнорировать кэш и снова запросить API |

Примеры:

```bash
node --env-file=.env src/index.js --city "Москва"
node --env-file=.env src/index.js --city "Москва, Минск" --days 5
node --env-file=.env src/index.js --city "Москва" --days 3 --no-cache
```

Дополнительные npm-скрипты:

```bash
npm test              # демо-запуск с примером городов
npm run lint:check    # проверка ESLint
npm run lint:fix      # автоисправление ESLint
npm run format:check  # проверка Prettier
npm run format:fix    # форматирование Prettier
npm run check         # lint + format (проверка)
npm run fix           # lint + format (исправление)
```

## 6. Пример вывода в консоль

```
Москва, Россия (55.75204, 37.61781) (network)
 # | Date       | Max °C  | Min °C | Precipitation mm
---|------------|---------|--------|------------------
 1 | 2026-09-13 | 16.2    | 7.7    | 0
 2 | 2026-09-14 | 18.4    | 9.2    | 0
 3 | 2026-09-15 | 18.6    | 11.7   | 0.1
```

`(network)` — данные из API; `(cache)` — из сохранённого отчёта за сегодня.

Отчёты сохраняются в:

```text
reports/{город}-{ГГГГ-ММ-ДД}.json
```

## 7. Обрабатываемые ошибки и коды завершения

### Аргументы CLI

| Ситуация | Сообщение |
|----------|-----------|
| Нет `--city` | `Missing required argument: --city "Moscow, Kazan"` |
| `--city` без значения | `Missing value for --city` |
| `--days` без значения | `Missing value for --days` |
| `--days` не целое 1–7 | `Argument --days must be an integer from 1 to 7` |
| Неизвестный флаг | `Unknown argument: ...` |

### Геокодинг

| Ситуация | Сообщение |
|----------|-----------|
| Город не найден | `City {cityName} not found` |
| HTTP 4xx | `Geocoding client error ({status}) for "{cityName}"` |
| HTTP 5xx | `Geocoding server error ({status}) for "{cityName}"` |
| Таймаут | `Geocoding timeout for "{cityName}"` |
| Сеть | `Network error while geocoding "{cityName}"` |
| Битый JSON | `Invalid JSON in geocoding response for "{cityName}"` |

### Прогноз

| Ситуация | Сообщение |
|----------|-----------|
| HTTP 4xx | `Forecast client error ({status})` |
| HTTP 5xx | `Forecast server error ({status})` |
| Таймаут | `Weather forecast timeout` |
| Сеть | `Network error while fetching forecast` |
| Битый JSON | `Invalid JSON in forecast response` |
| Нет данных | `Forecast data is missing` |

### Кэш / файлы

| Ситуация | Сообщение |
|----------|-----------|
| Ошибка чтения отчёта | `Failed to read report for {cityName}: ...` |

### Коды завершения

| Код | Значение |
|-----|----------|
| `0` | Успех по всем запрошенным городам |
| `1` | Ошибка CLI/выполнения или сбой хотя бы по одному городу |

## 8. Структура проекта

```text
src/
  index.js                 # точка входа
  config.js                # конфигурация из env
  cli/parseArgs.js         # разбор аргументов
  api/                     # HTTP-клиент Open-Meteo
    getCityCoordinates.js
    getWeatherByCoordinates.js
  services/getWeather.js   # бизнес-логика, параллельность, кэш
  storage/                 # чтение/запись отчётов
  format/printWeather.js   # вывод в консоль
docs/postman/              # коллекция Postman (запросы геокодинга и прогноза, переменные, примеры успешных и ошибочных ответов) 
reports/                   # сгенерированные отчёты (в .gitignore)
```

