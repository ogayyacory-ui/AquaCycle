from datetime import datetime

from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import ReportAuditLog, WaterReport


reports_bp = Blueprint("reports", __name__)


def _parse_datetime(value):
    if value in (None, ""):
        return None
    if isinstance(value, datetime):
        return value
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def _add_audit_entry(report, action, actor="system", details=None):
    entry = ReportAuditLog(
        report_id=report.id,
        action=action,
        actor=actor,
        details=details,
    )
    db.session.add(entry)
    return entry


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


@reports_bp.get("/<int:report_id>/audit")
def get_report_audit(report_id):
    report = WaterReport.query.get(report_id)
    if not report:
        return jsonify({"error": "Report not found"}), 404

    logs = ReportAuditLog.query.filter_by(report_id=report.id).order_by(
        ReportAuditLog.created_at.asc()
    ).all()
    return jsonify({"report_id": report.id, "timeline": [log.to_dict() for log in logs]})


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
        video_url=data.get("video_url"),
        source=str(data.get("source") or "citizen").strip() or "citizen",
        status=str(data.get("status") or "reported").strip() or "reported",
        verified=bool(data.get("verified", False)),
        assigned_to=data.get("assigned_to"),
        risk_score=data.get("risk_score"),
        observation_time=_parse_datetime(data.get("observation_time")),
        location_accuracy_m=data.get("location_accuracy_m"),
        resolution_note=data.get("resolution_note"),
    )

    db.session.add(report)
    db.session.flush()
    _add_audit_entry(
        report,
        action="created",
        actor=report.source,
        details="Report created through the citizen or officer intake workflow.",
    )
    db.session.commit()

    return jsonify({
        "message": "Your report has entered the Water Action Network.",
        "report": report.to_dict()
    }), 201


@reports_bp.patch("/<int:report_id>/status")
def update_report_status(report_id):
    report = WaterReport.query.get(report_id)
    if not report:
        return jsonify({"error": "Report not found"}), 404

    data = request.get_json() or {}
    status = str(data.get("status") or "").strip()
    if not status:
        return jsonify({"error": "Status is required."}), 400

    report.status = status
    if "verified" in data:
        report.verified = bool(data.get("verified"))
    if "assigned_to" in data:
        report.assigned_to = data.get("assigned_to")
    if "resolution_note" in data:
        report.resolution_note = data.get("resolution_note")
    if "risk_score" in data:
        report.risk_score = data.get("risk_score")
    if "source" in data:
        report.source = str(data.get("source") or "citizen").strip() or "citizen"
    if "observation_time" in data:
        report.observation_time = _parse_datetime(data.get("observation_time"))

    _add_audit_entry(
        report,
        action="status_updated",
        actor="officer",
        details=f"Status changed to {status}.",
    )
    db.session.commit()
    return jsonify({"message": "Report status updated.", "report": report.to_dict()})
