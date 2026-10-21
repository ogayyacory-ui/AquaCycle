import secrets
from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


def generate_tracking_number():
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    return f"AQC-{timestamp}-{secrets.token_hex(3).upper()}"


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True, index=True)
    phone = db.Column(db.String(40), nullable=False, default="")
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone or "",
        }


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

    tracking_number = db.Column(
        db.String(32),
        nullable=False,
        unique=True,
        index=True,
        default=generate_tracking_number
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

    source = db.Column(
        db.String(50),
        nullable=False,
        default="citizen"
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

    video_url = db.Column(
        db.String(500),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="reported"
    )

    verified = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    assigned_to = db.Column(
        db.String(200),
        nullable=True
    )

    risk_score = db.Column(
        db.Float,
        nullable=True
    )

    observation_time = db.Column(
        db.DateTime,
        nullable=True
    )

    location_accuracy_m = db.Column(
        db.Float,
        nullable=True
    )

    resolution_note = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    audit_logs = db.relationship(
        "ReportAuditLog",
        backref="report",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # ---------------------------------------
    # Convert to JSON
    # ---------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "tracking_number": self.tracking_number,
            "problem_type": self.problem_type,
            "location": self.location,
            "description": self.description,
            "urgency": self.urgency,
            "source": self.source,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "photo_url": self.photo_url,
            "video_url": self.video_url,
            "status": self.status,
            "verified": self.verified,
            "assigned_to": self.assigned_to,
            "risk_score": self.risk_score,
            "observation_time": self.observation_time.isoformat() if self.observation_time else None,
            "location_accuracy_m": self.location_accuracy_m,
            "resolution_note": self.resolution_note,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class ReportAuditLog(db.Model):
    __tablename__ = "report_audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("water_reports.id"), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    actor = db.Column(db.String(100), nullable=False, default="system")
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "report_id": self.report_id,
            "action": self.action,
            "actor": self.actor,
            "details": self.details,
            "created_at": self.created_at.isoformat(),
        }
