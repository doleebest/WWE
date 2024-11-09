import pyrebase
import json

class DBhandler:
    def __init__(self):
        with open('./authentication/firebase_auth.json') as f:
            config=json.load(f)

        firebase = pyrebase.initialize_app(config)
        self.db = firebase.database()

    def insert_item(self, name, data, img_path):
        item_info ={
            "sellerId": data['sellerId'],
            "contact": data['contact'],
            "productName": data['productName'],
            "price": data['price'],
            "img_path": img_path,
            #"continent": data['continent'],
            "nation": data['nation'],
            "address": data['address'],
            #"state": data['state'],
            "description": data['description']
        }
        self.db.child("item").child(name).set(item_info)
        print(data,img_path)
        return True