import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from .extensions import db
from .services.simulator_service import calculate_simulation


def create_app():
    """Create and configure the Flask application."""
    load_dotenv()

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///app.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)
    db.init_app(app)

    @app.route("/", methods=["GET", "POST"])
    def index():
        if request.method == "POST":
            return jsonify(request.get_json(silent=True) or {}), 201
        return jsonify([]), 200

    @app.route("/api", methods=["GET", "POST"])
    @app.route("/api/", methods=["GET", "POST"])
    def api_index():
        if request.method == "POST":
            return jsonify(request.get_json(silent=True) or {}), 201
        return jsonify([]), 200

    @app.get("/api/health")
    def health_check():
        return jsonify(status="ok"), 200

    @app.route("/api/simulator/calculate", methods=["GET", "POST"])
    def calculate_simulator():
        try:
            return jsonify(calculate_simulation(request.get_json(silent=True))), 200
        except ValueError as error:
            return jsonify(error=str(error)), 400

    @app.route("/api/<path:resource>", methods=["GET", "POST"])
    def empty_api_response(resource):
        if request.method == "POST":
            return jsonify(request.get_json(silent=True) or {}), 201
        return jsonify([]), 200

    return app
