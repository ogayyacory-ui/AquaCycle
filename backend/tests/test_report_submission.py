import unittest
import os

os.environ.setdefault("AQUACYCLE_SECRET_KEY", "test-only-aquacycle-secret")
from app import create_app


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


if __name__ == "__main__":
    unittest.main()
