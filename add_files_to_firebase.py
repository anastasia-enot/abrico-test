import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate("/Users/anastasiabarkova/Desktop/abrico/front-script/vite-project/src/firebase/abrico-test-firebase-adminsdk-fkqyv-037991a628.json")

app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://abrico-test.firebaseio.com/'  # Replace with your database URL
})

db = firestore.client()

print(db)

files = [{
   "id":"INV-1234",
   "date":"Feb 3, 2023",
   "status":"Refunded",
   "customer":{
      "initial":"O",
      "name":"Olivia Ryhe",
      "email":"olivia@email.com"
   }
},
{
   "id":"INV-1233",
   "date":"Feb 3, 2023",
   "status":"Paid",
   "customer":{
      "initial":"S",
      "name":"Steve Hampton",
      "email":"steve.hamp@email.com"
   }
},
{
   "id":"INV-1232",
   "date":"Feb 3, 2023",
   "status":"Refunded",
   "customer":{
      "initial":"C",
      "name":"Ciaran Murray",
      "email":"ciaran.murray@email.com"
   }
},
{
   "id":"INV-1231",
   "date":"Feb 3, 2023",
   "status":"Refunded",
   "customer":{
      "initial":"M",
      "name":"Maria Macdonald",
      "email":"maria.mc@email.com"
   }
},
{
   "id":"INV-1230",
   "date":"Feb 3, 2023",
   "status":"Cancelled",
   "customer":{
      "initial":"C",
      "name":"Charles Fulton",
      "email":"fulton@email.com"
   }
},
{
   "id":"INV-1229",
   "date":"Feb 3, 2023",
   "status":"Cancelled",
   "customer":{
      "initial":"J",
      "name":"Jay Hooper",
      "email":"hooper@email.com"
   }
},
{
   "id":"INV-1228",
   "date":"Feb 3, 2023",
   "status":"Refunded",
   "customer":{
      "initial":"K",
      "name":"Krystal Stevens",
      "email":"k.stevens@email.com"
   }
},
{
   "id":"INV-1227",
   "date":"Feb 3, 2023",
   "status":"Paid",
   "customer":{
      "initial":"S",
      "name":"Sachin Flynn",
      "email":"s.flyn@email.com"
   }
},
{
   "id":"INV-1226",
   "date":"Feb 3, 2023",
   "status":"Cancelled",
   "customer":{
      "initial":"B",
      "name":"Bradley Rosales",
      "email":"brad123@email.com"
   }
},
{
   "id":"INV-1225",
   "date":"Feb 3, 2023",
   "status":"Paid",
   "customer":{
      "initial":"O",
      "name":"Olivia Ryhe",
      "email":"olivia@email.com"
   }
},
{
   "id":"INV-1224",
   "date":"Feb 3, 2023",
   "status":"Cancelled",
   "customer":{
      "initial":"S",
      "name":"Steve Hampton",
      "email":"steve.hamp@email.com"
   }
},
{
   "id":"INV-1223",
   "date":"Feb 3, 2023",
   "status":"Paid",
   "customer":{
      "initial":"C",
      "name":"Ciaran Murray",
      "email":"ciaran.murray@email.com"
   }
},
{
   "id":"INV-1221",
   "date":"Feb 3, 2023",
   "status":"Refunded",
   "customer":{
      "initial":"M",
      "name":"Maria Macdonald",
      "email":"maria.mc@email.com"
   }
},
{
   "id":"INV-1220",
   "date":"Feb 3, 2023",
   "status":"Paid",
   "customer":{
      "initial":"C",
      "name":"Charles Fulton",
      "email":"fulton@email.com"
   }
},
{
   "id":"INV-1219",
   "date":"Feb 3, 2023",
   "status":"Cancelled",
   "customer":{
      "initial":"J",
      "name":"Jay Hooper",
      "email":"hooper@email.com"
   }
},
{
   "id":"INV-1218",
   "date":"Feb 3, 2023",
   "status":"Cancelled",
   "customer":{
      "initial":"K",
      "name":"Krystal Stevens",
      "email":"k.stevens@email.com"
   }
},
{
   "id":"INV-1217",
   "date":"Feb 3, 2023",
   "status":"Paid",
   "customer":{
      "initial":"S",
      "name":"Sachin Flynn",
      "email":"s.flyn@email.com"
   }
},
{
   "id":"INV-1216",
   "date":"Feb 3, 2023",
   "status":"Cancelled",
   "customer":{
      "initial":"B",
      "name":"Bradley Rosales",
      "email":"brad123@email.com"
   }
}]

for file in files:
    db.collection("orders").document(file['id']).set(file)