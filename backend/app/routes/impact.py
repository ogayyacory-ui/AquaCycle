from flask import Blueprint, jsonify

from ..models import Event, WaterReport


impact_bp = Blueprint(
    "impact",
    __name__
)


# ============================================================
# IMPACT DASHBOARD
# ============================================================

@impact_bp.get("")
def get_impact():

    # ----------------------------------------
    # Get database counts
    # ----------------------------------------

    community_reports = WaterReport.query.count()

    community_events = Event.query.count()

    # ----------------------------------------
    # Demo platform metrics
    # ----------------------------------------

    water_saved_litres = 10_450_000

    projects = 127

    people_reached = 84_000

    pollution_hotspots = 56

    # ----------------------------------------
    # Return dashboard
    # ----------------------------------------

    return jsonify({

        "success": True,

        "demo": True,

        "metrics": {

            "water_saved_litres":
                water_saved_litres,

            "community_reports":
                community_reports,

            "projects":
                projects,

            "people_reached":
                people_reached,

            "pollution_hotspots":
                pollution_hotspots,

            "community_events":
                community_events
        },

        "note": (
            "Water saved, projects, people reached and "
            "pollution hotspot figures are illustrative "
            "demo values. Community reports and events "
            "reflect the current local database."
        )
    })