from flask import Blueprint, jsonify

from ..extensions import db
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
    total_reports = WaterReport.query.count()
    community_events = Event.query.count()
    resolved_reports = WaterReport.query.filter_by(status="resolved").count()
    pending_reports = WaterReport.query.filter(WaterReport.status != "resolved").count()
    verified_reports = WaterReport.query.filter_by(verified=True).count()

    reports_by_status = {
        row[0]: row[1]
        for row in db.session.query(WaterReport.status, db.func.count(WaterReport.id))
        .group_by(WaterReport.status)
        .all()
    }

    return jsonify({
        "success": True,
        "demo": False,
        "metrics": {
            "total_reports": total_reports,
            "resolved_reports": resolved_reports,
            "pending_reports": pending_reports,
            "verified_reports": verified_reports,
            "community_reports": total_reports,
            "community_events": community_events,
            "reports_by_status": reports_by_status,
            "water_saved_litres": 0,
            "projects": 0,
            "people_reached": 0,
            "pollution_hotspots": 0,
        },
        "note": (
            "Impact figures are based on the current database state and should be "
            "verified with operational records before being published in official reports."
        )
    })