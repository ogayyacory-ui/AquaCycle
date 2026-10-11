import os
import unittest
from uuid import uuid4

os.environ.setdefault("AQUACYCLE_SECRET_KEY", "test-only-aquacycle-secret")

from app import create_app
from app.extensions import db
from app.models import User


class AuthenticationTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()
        self.email = f"test-{uuid4().hex}@example.com"

    def tearDown(self):
        with self.app.app_context():
            user = User.query.filter_by(email=self.email).first()
            if user:
                db.session.delete(user)
                db.session.commit()

    def test_signup_login_and_profile(self):
        signup = self.client.post(
            "/api/auth/signup",
            json={
                "name": "Aqua Tester",
                "email": self.email,
                "phone": "+254 700 000 000",
                "password": "safe-password-123",
            },
        )

        self.assertEqual(signup.status_code, 201)
        created = signup.get_json()
        self.assertEqual(created["user"]["phone"], "+254 700 000 000")
        self.assertTrue(created["token"])

        profile = self.client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {created['token']}"},
        )
        self.assertEqual(profile.status_code, 200)
        self.assertEqual(profile.get_json()["user"]["email"], self.email)

        login = self.client.post(
            "/api/auth/login",
            json={"email": self.email, "password": "safe-password-123"},
        )
        self.assertEqual(login.status_code, 200)
        self.assertTrue(login.get_json()["token"])


if __name__ == "__main__":
    unittest.main()
