from flask import Blueprint, jsonify, request

from app.services.weather_service import get_weather, search_city


weather_bp = Blueprint("weather", __name__, url_prefix="/api/weather")


@weather_bp.get("")
def weather():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify(
            {
                "success": False,
                "error": "latitude and longitude are required.",
            }
        ), 400

    try:
        result = get_weather(latitude, longitude)

        return jsonify(
            {
                "success": True,
                "data": result,
            }
        )
    except ValueError as error:
        return jsonify(
            {
                "success": False,
                "error": str(error),
            }
        ), 400
    except RuntimeError as error:
        return jsonify(
            {
                "success": False,
                "error": str(error),
            }
        ), 502
    except Exception:
        return jsonify(
            {
                "success": False,
                "error": "Unable to retrieve weather data.",
            }
        ), 500


@weather_bp.get("/search")
def city_search():
    city = request.args.get("city", "")

    try:
        results = search_city(city)

        return jsonify(
            {
                "success": True,
                "data": results,
            }
        )
    except ValueError as error:
        return jsonify(
            {
                "success": False,
                "error": str(error),
            }
        ), 400
    except RuntimeError as error:
        return jsonify(
            {
                "success": False,
                "error": str(error),
            }
        ), 502
    except Exception:
        return jsonify(
            {
                "success": False,
                "error": "Unable to search for the location.",
            }
        ), 500