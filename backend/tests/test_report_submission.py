import unittest
import os

os.environ.setdefault("AQUACYCLE_SECRET_KEY", "test-only-aquacycle-secret")
from app import create_app
from app.extensions import db
from app.models import EventRegistration


class ReportSubmissionTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def test_report_accepts_location_and_video_media(self):
        response = self.client.post(
            "/api/reports",
            json={
                "problem_type": "Flooding",
                "location": "12 Main St, Nairobi",
                "description": "Water is pooling outside the school gate.",
                "urgency": "high",
                "latitude": -1.2921,
                "longitude": 36.8219,
                "photo_url": "https://example.com/photo.jpg",
                "video_url": "https://example.com/video.mp4",
            },
        )

        self.assertEqual(response.status_code, 201)
        payload = response.get_json()
        self.assertEqual(payload["report"]["location"], "12 Main St, Nairobi")
        self.assertEqual(payload["report"]["photo_url"], "https://example.com/photo.jpg")
        self.assertEqual(payload["report"]["video_url"], "https://example.com/video.mp4")

    def test_report_tracks_government_ready_metadata(self):
        response = self.client.post(
            "/api/reports",
            json={
                "problem_type": "Water outage",
                "location": "Kibra, Nairobi",
                "description": "No water for the last 2 days near the clinic.",
                "urgency": "high",
                "latitude": -1.31,
                "longitude": 36.82,
                "source": "citizen",
                "status": "under_review",
                "assigned_to": "Operations Desk",
            },
        )

        self.assertEqual(response.status_code, 201)
        payload = response.get_json()
        self.assertIn("tracking_number", payload["report"])
        self.assertEqual(payload["report"]["status"], "under_review")
        self.assertEqual(payload["report"]["source"], "citizen")
        self.assertEqual(payload["report"]["assigned_to"], "Operations Desk")

    def test_impact_endpoint_reports_verified_service_metrics(self):
        self.client.post(
            "/api/reports",
            json={
                "problem_type": "Leak",
                "location": "Westlands",
                "description": "Pipe leak outside a school.",
                "urgency": "medium",
                "status": "resolved",
                "verified": True,
            },
        )

        response = self.client.get("/api/impact")
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertGreaterEqual(payload["metrics"]["total_reports"], 1)
        self.assertIn("resolved_reports", payload["metrics"])
        self.assertIn("pending_reports", payload["metrics"])

    def test_weather_endpoint_reports_source_metadata(self):
        response = self.client.get("/api/weather?latitude=-1.29&longitude=36.82")
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertIn("source", payload["data"])
        self.assertIn("last_updated", payload["data"])
        self.assertIn("forecast_period", payload["data"])

    def test_delete_event_removes_event_and_its_registrations(self):
        event_response = self.client.post(
            "/api/events",
            json={
                "title": "Neighborhood cleanup",
                "description": "Remove waste from the canal.",
                "category": "Cleanup",
                "location": "Canal Park",
                "start_datetime": "2026-11-01T09:00:00",
                "organizer": "AquaCycle",
            },
        )
        self.assertEqual(event_response.status_code, 201)
        event_id = event_response.get_json()["event"]["id"]

        registration_response = self.client.post(
            f"/api/events/{event_id}/register",
            json={"name": "Sam", "email": "sam@example.com"},
        )
        self.assertEqual(registration_response.status_code, 200)

        delete_response = self.client.delete(f"/api/events/{event_id}")
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(self.client.get(f"/api/events/{event_id}").status_code, 404)
        with self.app.app_context():
            registration = EventRegistration.query.filter_by(event_id=event_id).first()
            self.assertIsNone(registration)

    def test_deleting_missing_event_returns_not_found(self):
        response = self.client.delete("/api/events/999999")
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
