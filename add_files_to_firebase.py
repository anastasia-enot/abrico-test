import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate("/Users/anastasiabarkova/Desktop/abrico/front-script/vite-project/probable-signal-418412-df9a70ef3e52.json")

app = firebase_admin.initialize_app(cred)

db = firestore.client()

print(db)