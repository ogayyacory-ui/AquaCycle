from datetime import datetime

from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models import Event, EventRegistration


events_bp = Blueprint("events", __name__)


@events_bp.get("")
def get_events():
    events = Event.query.order_by(
        Event.start_datetime.asc()
    ).all()

    return jsonify([
        event.to_dict()
        for event in events
    ])


@events_bp.get("/<int:event_id>")
def get_event(event_id):
    event = Event.query.get(event_id)

    if not event:
        return jsonify({
            "error": "Event not found"
        }), 404

    return jsonify(event.to_dict())


@events_bp.delete("/<int:event_id>")
def delete_event(event_id):
    event = Event.query.get(event_id)

    if not event:
        return jsonify({
            "error": "Event not found"
        }), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({
        "message": "Event deleted successfully"
    })


@events_bp.post("")
def create_event():
    data = request.get_json() or {}

    required_fields = [
        "title",
        "description",
        "category",
        "location",
        "start_datetime",
        "organizer"
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

    try:
        start_datetime = datetime.fromisoformat(
            data["start_datetime"]
        )
    except ValueError:
        return jsonify({
            "error": "Invalid date format. Use YYYY-MM-DDTHH:MM:SS"
        }), 400

    max_participants = data.get(
        "max_participants",
        50
    )

    if not isinstance(max_participants, int):
        return jsonify({
            "error": "max_participants must be a number"
        }), 400

    event = Event(
        title=data["title"],
        description=data["description"],
        category=data["category"],
        location=data["location"],
        start_datetime=start_datetime,
        organizer=data["organizer"],
        max_participants=max_participants,
        image_url=data.get("image_url")
    )

    db.session.add(event)
    db.session.commit()

    return jsonify({
        "message": "Event published successfully",
        "event": event.to_dict()
    }), 201


@events_bp.post("/<int:event_id>/register")
def register_for_event(event_id):
    event = Event.query.get(event_id)

    if not event:
        return jsonify({
            "error": "Event not found"
        }), 404

    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({
            "error": "Name and email are required"
        }), 400

    if event.registered_count >= event.max_participants:
        return jsonify({
            "error": "This event is full"
        }), 400

    registration = EventRegistration(
        event_id=event.id,
        name=name,
        email=email
    )

    event.registered_count += 1

    db.session.add(registration)
    db.session.commit()

    return jsonify({
        "message": "Registration successful",
        "event": event.to_dict()
    })