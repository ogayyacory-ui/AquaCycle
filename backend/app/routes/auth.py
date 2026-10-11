import os
import re
import secrets

from flask import Blueprint, jsonify, request
from flask import current_app
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from ..extensions import db
from ..models import User


auth_bp = Blueprint("auth", __name__)
EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24


def _serializer():
    return URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"], salt="aquacycle-auth-token"
    )


def create_token(user_id):
    return _serializer().dumps({"user_id": user_id})


def verify_token(token):
    try:
        data = _serializer().loads(token, max_age=TOKEN_MAX_AGE_SECONDS)
        return data.get("user_id")
    except (BadSignature, SignatureExpired):
        return None


def auth_response(user, message, status_code=200):
    return jsonify(
        {
            "message": message,
            "user": user.to_dict(),
            "token": create_token(user.id),
        }
    ), status_code


@auth_bp.post("/signup")
@auth_bp.post("/register")
def signup():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    phone = str(data.get("phone", "")).strip()
    password = str(data.get("password", ""))

    if len(name) < 2:
        return jsonify({"error": "Please enter your name."}), 400
    if not EMAIL.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account already exists for this email. Log in instead."}), 409

    if len(phone) > 40:
        return jsonify({"error": "Phone number is too long."}), 400

    user = User(name=name, email=email, phone=phone)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return auth_response(user, "Account created successfully.", 201)


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Email or password is incorrect."}), 401
    return auth_response(user, "Login successful.")


@auth_bp.get("/me")
def me():
    authorization = request.headers.get("Authorization", "")
    if not authorization.startswith("Bearer "):
        return jsonify({"error": "Authentication required."}), 401

    user_id = verify_token(authorization[7:])
    if user_id is None:
        return jsonify({"error": "Token expired or invalid."}), 401

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "Account not found."}), 404

    return jsonify({"user": user.to_dict()})


@auth_bp.post("/google")
def google_login():
    token = (request.get_json(silent=True) or {}).get("id_token")
    if not token or not isinstance(token, str):
        return jsonify({"error": "A Google identity token is required."}), 400

    client_ids = {
        client_id.strip()
        for client_id in os.environ.get("GOOGLE_OAUTH_CLIENT_IDS", "").split(",")
        if client_id.strip()
    }
    if not client_ids:
        return jsonify({"error": "Google sign-in is not configured on the server."}), 503

    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token

        identity = id_token.verify_oauth2_token(token, google_requests.Request())
    except ImportError:
        return jsonify({"error": "The Google authentication package is not installed on the server."}), 503
    except Exception:
        return jsonify({"error": "Google could not verify this sign-in. Please try again."}), 401

    if identity.get("aud") not in client_ids:
        return jsonify({"error": "This Google sign-in was issued for a different app."}), 401
    if not identity.get("email_verified") or not identity.get("email"):
        return jsonify({"error": "A verified Google email address is required."}), 401

    email = identity["email"].strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(name=identity.get("name") or email.split("@")[0], email=email)
        # This random value prevents password login until a password-reset flow
        # is added; Google remains the only credential for this account.
        user.set_password(secrets.token_urlsafe(32))
        db.session.add(user)
        db.session.commit()

    return auth_response(user, "Login successful.")
