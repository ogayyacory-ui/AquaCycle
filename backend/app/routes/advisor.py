from flask import Blueprint, jsonify, request

from app.services.ai_service import generate_answer


advisor_bp = Blueprint("advisor", __name__, url_prefix="/api/advisor")


@advisor_bp.post("")
def ask_advisor():
	payload = request.get_json(silent=True) or {}
	message = payload.get("message")
	context = payload.get("context", {})

	if not isinstance(message, str) or not message.strip():
		return jsonify(
			{
				"success": False,
				"error": "message is required.",
			}
		), 400

	if not isinstance(context, dict):
		return jsonify(
			{
				"success": False,
				"error": "context must be an object.",
			}
		), 400

	try:
		result = generate_answer(message.strip(), context)
		return jsonify(
			{
				"success": True,
				**result,
			}
		)
	except RuntimeError as error:
		return jsonify(
			{
				"success": False,
				"error": str(error),
			}
		), 502
	except Exception:
		return jsonify(
			{
				"success": False,
				"error": "Unable to contact the advisor service.",
			}
		), 500
