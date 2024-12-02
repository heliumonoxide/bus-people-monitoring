from google.oauth2 import service_account
import google.auth.transport.requests

# Path to your Firebase service account JSON key file
SERVICE_ACCOUNT_FILE = "env/people-bus-monitoring-firebase-adminsdk-tysym-f1f1926e67.json"

# Create credentials object
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)

# Generate access token
request = google.auth.transport.requests.Request()
credentials.refresh(request)

print("Access Token:", credentials.token)