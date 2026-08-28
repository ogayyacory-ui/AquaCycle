from datetime import datetime

from .extensions import db


# ============================================================
# EVENT
# ============================================================

class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=False
    )

    location = db.Column(
        db.String(200),
        nullable=False
    )

    start_datetime = db.Column(
        db.DateTime,
        nullable=False
    )

    organizer = db.Column(
        db.String(150),
        nullable=False
    )

    max_participants = db.Column(
        db.Integer,
        nullable=False,
        default=50
    )

    registered_count = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    image_url = db.Column(
        db.String(500),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    # ---------------------------------------
    # Relationship
    # ---------------------------------------

    registrations = db.relationship(
        "EventRegistration",
        backref="event",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # ---------------------------------------
    # Convert to JSON
    # ---------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "location": self.location,
            "start_datetime": self.start_datetime.isoformat(),
            "organizer": self.organizer,
            "max_participants": self.max_participants,
            "registered_count": self.registered_count,
            "spots_remaining": max(
                0,
                self.max_participants - self.registered_count
            ),
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat()
        }


# ============================================================
# EVENT REGISTRATION
# ============================================================

class EventRegistration(db.Model):
    __tablename__ = "event_registrations"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    event_id = db.Column(
        db.Integer,
        db.ForeignKey("events.id"),
        nullable=False
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    email = db.Column(
        db.String(200),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    # ---------------------------------------
    # Convert to JSON
    # ---------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }


# ============================================================
# WATER REPORT
# ============================================================

class WaterReport(db.Model):
    __tablename__ = "water_reports"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    problem_type = db.Column(
        db.String(100),
        nullable=False
    )

    location = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    urgency = db.Column(
        db.String(50),
        nullable=False
    )

    latitude = db.Column(
        db.Float,
        nullable=True
    )

    longitude = db.Column(
        db.Float,
        nullable=True
    )

    photo_url = db.Column(
        db.String(500),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="reported"
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    # ---------------------------------------
    # Convert to JSON
    # ---------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "problem_type": self.problem_type,
            "location": self.location,
            "description": self.description,
            "urgency": self.urgency,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "photo_url": self.photo_url,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }