from datetime import datetime

import requests


OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}


def validate_coordinates(latitude, longitude):
    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except (TypeError, ValueError):
        raise ValueError("Latitude and longitude must be numbers.")

    if not -90 <= latitude <= 90:
        raise ValueError("Latitude must be between -90 and 90.")

    if not -180 <= longitude <= 180:
        raise ValueError("Longitude must be between -180 and 180.")

    return latitude, longitude


def weather_condition(code):
    return WEATHER_CODES.get(code, "Unknown conditions")


def _number(value):
    if value is None:
        return None

    try:
        return round(float(value), 1)
    except (TypeError, ValueError):
        return None


def normalize_weather(data):
    current = data.get("current", {})
    daily = data.get("daily", {})

    dates = daily.get("time", [])
    max_temperatures = daily.get("temperature_2m_max", [])
    min_temperatures = daily.get("temperature_2m_min", [])
    precipitation = daily.get("precipitation_sum", [])
    rain_probability = daily.get("precipitation_probability_max", [])
    daily_codes = daily.get("weather_code", [])
    sunrise = daily.get("sunrise", [])
    sunset = daily.get("sunset", [])

    forecast = []

    for index, date in enumerate(dates[:5]):
        code = (
            daily_codes[index]
            if index < len(daily_codes)
            else None
        )

        forecast.append(
            {
                "date": date,
                "temperatureMax": _number(
                    max_temperatures[index]
                    if index < len(max_temperatures)
                    else None
                ),
                "temperatureMin": _number(
                    min_temperatures[index]
                    if index < len(min_temperatures)
                    else None
                ),
                "precipitation": _number(
                    precipitation[index]
                    if index < len(precipitation)
                    else None
                ),
                "precipitationProbability": (
                    rain_probability[index]
                    if index < len(rain_probability)
                    else None
                ),
                "weatherCode": code,
                "condition": weather_condition(code),
                "sunrise": sunrise[index] if index < len(sunrise) else None,
                "sunset": sunset[index] if index < len(sunset) else None,
            }
        )

    current_code = current.get("weather_code")

    hourly = data.get("hourly", {})
    hourly_forecast = []
    hourly_times = hourly.get("time", [])
    hourly_temperatures = hourly.get("temperature_2m", [])
    hourly_codes = hourly.get("weather_code", [])
    hourly_precipitation = hourly.get("precipitation_probability", [])

    for index, time in enumerate(hourly_times[:24]):
        hourly_forecast.append({
            "time": time,
            "temperature": _number(
                hourly_temperatures[index]
                if index < len(hourly_temperatures)
                else None
            ),
            "weatherCode": hourly_codes[index] if index < len(hourly_codes) else None,
            "condition": weather_condition(
                hourly_codes[index] if index < len(hourly_codes) else None
            ),
            "precipitationProbability": (
                hourly_precipitation[index]
                if index < len(hourly_precipitation)
                else None
            ),
        })

    return {
        "location": {
            "latitude": _number(data.get("latitude")),
            "longitude": _number(data.get("longitude")),
            "timezone": data.get("timezone"),
        },
        "current": {
            "temperature": _number(current.get("temperature_2m")),
            "feelsLike": _number(current.get("apparent_temperature")),
            "humidity": _number(current.get("relative_humidity_2m")),
            "precipitation": _number(current.get("precipitation")),
            "windSpeed": _number(current.get("wind_speed_10m")),
            "windDirection": _number(current.get("wind_direction_10m")),
            "precipitationProbability": _number(
                current.get("precipitation_probability")
            ),
            "weatherCode": current_code,
            "condition": weather_condition(current_code),
        },
        "hourly": hourly_forecast,
        "forecast": forecast,
        "units": {
            "temperature": "°C",
            "precipitation": "mm",
            "windSpeed": "km/h",
        },
    }


def get_weather(latitude, longitude):
    latitude, longitude = validate_coordinates(latitude, longitude)

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "apparent_temperature,"
            "relative_humidity_2m,"
            "precipitation,"
            "weather_code,"
            "wind_speed_10m,"
            "wind_direction_10m,"
            "precipitation_probability"
        ),
        "hourly": (
            "temperature_2m,"
            "weather_code,"
            "precipitation_probability"
        ),
        "daily": (
            "weather_code,"
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_sum,"
            "precipitation_probability_max,"
            "sunrise,"
            "sunset"
        ),
        "forecast_days": 7,
        "timezone": "auto",
    }

    try:
        response = requests.get(
            OPEN_METEO_FORECAST_URL,
            params=params,
            timeout=10,
        )
        response.raise_for_status()
        weather_data = normalize_weather(response.json())
        weather_data["source"] = "Open-Meteo"
        weather_data["last_updated"] = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
        weather_data["forecast_period"] = "7-day"
        weather_data["disclaimer"] = (
            "Weather data provides situational context only and must not be used alone to "
            "declare a drinking-water source safe or unsafe."
        )
        return weather_data
    except requests.RequestException as error:
        raise RuntimeError(
            "The weather provider could not be reached. "
            "Please try again later."
        ) from error


def search_city(city):
    if not isinstance(city, str):
        raise ValueError("City must be text.")

    city = city.strip()

    if not city:
        raise ValueError("City is required.")

    if len(city) > 100:
        raise ValueError("City name is too long.")

    try:
        response = requests.get(
            OPEN_METEO_GEOCODING_URL,
            params={
                "name": city,
                "count": 8,
                "language": "en",
                "format": "json",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as error:
        raise RuntimeError(
            "The location search service could not be reached."
        ) from error

    results = []

    for result in data.get("results", []):
        results.append(
            {
                "name": result.get("name"),
                "latitude": _number(result.get("latitude")),
                "longitude": _number(result.get("longitude")),
                "country": result.get("country"),
                "countryCode": result.get("country_code"),
                "admin1": result.get("admin1"),
                "timezone": result.get("timezone"),
            }
        )

    return results