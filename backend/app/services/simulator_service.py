def calculate_simulation(payload):
    """Estimate harvestable rainwater from a roof/catchment area."""
    payload = payload or {}

    area_m2 = _positive_number(
        payload.get("area_m2", payload.get("roof_area_m2", 100)), "area_m2"
    )
    rainfall_mm = _positive_number(payload.get("rainfall_mm", 15), "rainfall_mm")
    runoff_coefficient = _number(
        payload.get("runoff_coefficient", 0.8), "runoff_coefficient"
    )
    daily_demand_liters = _positive_number(
        payload.get("daily_demand_liters", 100), "daily_demand_liters"
    )

    if runoff_coefficient < 0 or runoff_coefficient > 1:
        raise ValueError("runoff_coefficient must be between 0 and 1")

    harvested_liters = round(area_m2 * rainfall_mm * runoff_coefficient, 2)
    days_of_water = round(harvested_liters / daily_demand_liters, 2)

    return {
        "systems": [
            {
                "id": "rainwater_tank",
                "name": "Rainwater Tank",
                "water_saved": harvested_liters,
                "waste_diverted": 0,
                "score": min(100, round(harvested_liters / 120)),
                "co2_reduction": round(harvested_liters / 48, 2),
                "people_impacted": max(1, round(harvested_liters / 240)),
                "estimated_days_of_water": days_of_water,
            }
        ]
    }


def _number(value, field_name):
    try:
        return float(value)
    except (TypeError, ValueError) as error:
        raise ValueError(f"{field_name} must be a number") from error


def _positive_number(value, field_name):
    value = _number(value, field_name)
    if value <= 0:
        raise ValueError(f"{field_name} must be greater than 0")
    return value
