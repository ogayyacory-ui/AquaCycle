from flask import Blueprint, request, jsonify


simulator_bp = Blueprint(
    "simulator",
    __name__
)


# ============================================================
# COMMUNITY SYSTEM OPTIONS
# ============================================================

SYSTEM_OPTIONS = {
    "rainwater_tank": {
        "name": "Rainwater Tank",
        "water_saved": 1200,
        "waste_diverted": 0,
        "score": 10,
        "co2_reduction": 25,
        "people_impacted": 5
    },

    "water_treatment": {
        "name": "Water Treatment System",
        "water_saved": 900,
        "waste_diverted": 0,
        "score": 12,
        "co2_reduction": 20,
        "people_impacted": 20
    },

    "public_toilet": {
        "name": "Public Eco-Toilet",
        "water_saved": 400,
        "waste_diverted": 0,
        "score": 8,
        "co2_reduction": 10,
        "people_impacted": 30
    },

    "recycling_station": {
        "name": "Recycling Station",
        "water_saved": 0,
        "waste_diverted": 250,
        "score": 8,
        "co2_reduction": 35,
        "people_impacted": 25
    },

    "drainage_system": {
        "name": "Sustainable Drainage System",
        "water_saved": 300,
        "waste_diverted": 0,
        "score": 7,
        "co2_reduction": 15,
        "people_impacted": 20
    },

    "wetland": {
        "name": "Constructed Wetland",
        "water_saved": 700,
        "waste_diverted": 0,
        "score": 12,
        "co2_reduction": 30,
        "people_impacted": 40
    },

    "solar_pump": {
        "name": "Solar Water Pump",
        "water_saved": 500,
        "waste_diverted": 0,
        "score": 7,
        "co2_reduction": 50,
        "people_impacted": 15
    },

    "community_garden": {
        "name": "Community Garden",
        "water_saved": 250,
        "waste_diverted": 0,
        "score": 5,
        "co2_reduction": 15,
        "people_impacted": 20
    },

    "water_sensor": {
        "name": "Smart Water Sensor",
        "water_saved": 800,
        "waste_diverted": 0,
        "score": 9,
        "co2_reduction": 10,
        "people_impacted": 10
    },

    "waste_collection": {
        "name": "Waste Collection Point",
        "water_saved": 0,
        "waste_diverted": 300,
        "score": 7,
        "co2_reduction": 25,
        "people_impacted": 30
    }
}


BASE_SCORE = 40


# ============================================================
# GET AVAILABLE SYSTEMS
# ============================================================

@simulator_bp.get("/options")
def get_options():

    options = []

    for key, system in SYSTEM_OPTIONS.items():

        options.append({
            "id": key,
            **system
        })

    return jsonify({
        "systems": options
    })


# ============================================================
# CALCULATE COMMUNITY SIMULATION
# ============================================================

@simulator_bp.post("/calculate")
def calculate():

    data = request.get_json() or {}

    systems = data.get("systems", [])

    # ----------------------------------------
    # Validate systems
    # ----------------------------------------

    if not isinstance(systems, list):

        return jsonify({
            "error": "systems must be an array"
        }), 400

    # ----------------------------------------
    # Remove duplicates
    # ----------------------------------------

    systems = list(dict.fromkeys(systems))

    # ----------------------------------------
    # Calculate values
    # ----------------------------------------

    water_saved = 0
    waste_diverted = 0
    score = BASE_SCORE
    co2_reduction = 0
    people_impacted = 0

    selected_systems = []

    invalid_systems = []

    for system_id in systems:

        system = SYSTEM_OPTIONS.get(system_id)

        if not system:

            invalid_systems.append(system_id)

            continue

        selected_systems.append({
            "id": system_id,
            "name": system["name"]
        })

        water_saved += system.get(
            "water_saved",
            0
        )

        waste_diverted += system.get(
            "waste_diverted",
            0
        )

        score += system.get(
            "score",
            0
        )

        co2_reduction += system.get(
            "co2_reduction",
            0
        )

        people_impacted += system.get(
            "people_impacted",
            0
        )

    # ----------------------------------------
    # Maximum score = 100
    # ----------------------------------------

    score = min(score, 100)

    # ----------------------------------------
    # Sanitation coverage
    # ----------------------------------------

    sanitation_coverage = 0

    if "public_toilet" in systems:
        sanitation_coverage += 25

    if "water_treatment" in systems:
        sanitation_coverage += 20

    if "wetland" in systems:
        sanitation_coverage += 15

    sanitation_coverage = min(
        sanitation_coverage,
        100
    )

    # ----------------------------------------
    # Build response
    # ----------------------------------------

    response = {
        "success": True,

        "selected_systems": selected_systems,

        "metrics": {
            "water_saved_litres": water_saved,

            "waste_diverted_kg": waste_diverted,

            "sanitation_coverage_percent":
                sanitation_coverage,

            "estimated_co2_reduction_kg":
                co2_reduction,

            "people_impacted":
                people_impacted,

            "water_resilience_score":
                score
        },

        "invalid_systems": invalid_systems,

        "demo": True,

        "note": (
            "Simulation values are illustrative estimates "
            "for the AquaCycle prototype and are not "
            "verified real-world measurements."
        )
    }

    return jsonify(response), 200