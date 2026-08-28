from flask import Flask
from flask_cors import CORS

from .extensions import db
from app.routes.advisor import advisor_bp
from app.routes.weather import weather_bp


def create_app():
    app = Flask(__name__)

    # ---------------------------------------
    # Configuration
    # ---------------------------------------

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///aquacycle.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
 # Keep your existing configuration here.
    CORS(app)

    # Keep all existing blueprint registrations.
    # Example:
    # app.register_blueprint(events_bp)
    # app.register_blueprint(reports_bp)
    # app.register_blueprint(solutions_bp)
    # app.register_blueprint(simulator_bp)
    # app.register_blueprint(impact_bp)

    app.register_blueprint(weather_bp)
    app.register_blueprint(advisor_bp)

    # ---------------------------------------
    # Extensions
    # ---------------------------------------

    CORS(app)
    db.init_app(app)

    # ---------------------------------------
    # Import Models
    # ---------------------------------------

    from .models import (
        Event,
        EventRegistration,
        WaterReport
    )

    # ---------------------------------------
    # Register Routes
    # ---------------------------------------

    from .routes.events import events_bp
    from .routes.reports import reports_bp
    from .routes.solutions import solutions_bp
    from .routes.simulator import simulator_bp
    from .routes.impact import impact_bp

    app.register_blueprint(
        events_bp,
        url_prefix="/api/events"
    )

    app.register_blueprint(
        reports_bp,
        url_prefix="/api/reports"
    )

    app.register_blueprint(
        solutions_bp,
        url_prefix="/api/solutions"
    )

    app.register_blueprint(
        simulator_bp,
        url_prefix="/api/simulator"
    )

    app.register_blueprint(
        impact_bp,
        url_prefix="/api/impact"
    )

    # ---------------------------------------
    # Home Route
    # ---------------------------------------

    @app.get("/")
    def home():
        return {
            "name": "AquaCycle API",
            "message": "Backend is running",
            "health_check": "/api/health"
        }

    # ---------------------------------------
    # Health Check
    # ---------------------------------------

    @app.get("/api/health")
    def health():
        return {
            "status": "ok",
            "message": "AquaCycle API is running"
        }

    # ---------------------------------------
    # Create Database Tables
    # ---------------------------------------

    with app.app_context():
        db.create_all()

    return app