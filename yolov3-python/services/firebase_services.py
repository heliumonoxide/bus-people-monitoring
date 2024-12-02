import firebase_admin
from firebase_admin import credentials, storage
from firebase_admin import firestore


class Connection:
    def initialize_sdk(self):
        # Use a service account.
        self.cred = credentials.Certificate(
            "env/people-bus-monitoring-firebase-adminsdk-tysym-f1f1926e67.json"
        )

        self.app = firebase_admin.initialize_app(
            self.cred,
            {
                "storageBucket": "people-bus-monitoring.firebasestorage.app"  # Replace with your Firebase Storage bucket name
            },
        )

        self.db = firestore.client()
        self.bucket = storage.bucket()

    def post_doc(self, data, collection_name):

        update_time, city_ref = self.db.collection(collection_name).add(data)

        print(f"Added document with id {city_ref.id} at {update_time}")

    def upload_image(self, file_path, destination_blob_name):
        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_filename(file_path)
        print(f"File {file_path} uploaded to {destination_blob_name}.")