from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models import WaterReport


reports_bp = Blueprint("reports", __name__)


@reports_bp.get("")
def get_reports():
    reports = WaterReport.query.order_by(
        WaterReport.created_at.desc()
    ).all()

    return jsonify([
        report.to_dict()
        for report in reports
    ])


@reports_bp.get("/<int:report_id>")
def get_report(report_id):
    report = WaterReport.query.get(report_id)

    if not report:
        return jsonify({
            "error": "Report not found"
        }), 404

    return jsonify(report.to_dict())


@reports_bp.post("")
def create_report():
    data = request.get_json() or {}

    required_fields = [
        "problem_type",
        "location",
        "description",
        "urgency"
    ]

    missing = [
        field
        for field in required_fields
        if not data.get(field)
    ]

    if missing:
        return jsonify({
            "error": "Missing required fields",
            "fields": missing
        }), 400

    report = WaterReport(
        problem_type=data["problem_type"],
        location=data["location"],
        description=data["description"],
        urgency=data["urgency"],
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        photo_url=data.get("photo_url"),
        video_url=data.get("video_url")
    )

    db.session.add(report)
    db.session.commit()

    return jsonify({
        "message": "Your report has entered the Water Action Network.",
        "report": report.to_dict()
    }), 201