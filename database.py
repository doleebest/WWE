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
            "continent": data['continent'],
            "nation": data['nation'],
            "address": data['address'],
            "state": data['state'],
            "description": data['description']
        }
        self.db.child("item").child(name).set(item_info)
        print(data,img_path)
        return True

    def insert_user(self, data, pw) :
         user_info = {
             "id" : data['id'],
             "pw" : pw,
             # "nickname" : data['nickname']
         }
         if self.user_duplicate_check(str(data['id'])): # id 중복 체크
             self.db.child("user").push(user_info)
             print(data)
             return True
         else:
             return False
         
    def user_duplicate_check(self, id_string):
        users = self.db.child("user").get()
        
        print("users###", users.val())
        if str(users.val()) == "None" : # first registration
            return True
        else :
            for res in users.each() :
                value = res.val()
                
                if value['id'] == id_string:
                    return False
            return True
        
    def find_user(self, id_, pw_):  
        users = self.db.child("user").get()
        target_value=[]
        for res in users.each():
            value = res.val()
            if value['id'] == id_ and value['pw'] == pw_:
              return True
        return False
    
    # my page 관련
    def get_user_wishlist(self,user_id):
        wishlist_ref = self.db.collection('wishlist').where('user_id', '==', user_id)
        wishlist = [doc.to_dict() for doc in wishlist_ref.stream()]
        return wishlist

    def get_user_purchases(self,user_id):
        purchases_ref = self.db.collection('purchases').where('user_id', '==', user_id)
        purchases = [doc.to_dict() for doc in purchases_ref.stream()]
        return purchases

    def get_user_sales(self,user_id):
        sales_ref = self,db.collection('products').where('seller_id', '==', user_id)
        sales = [doc.to_dict() for doc in sales_ref.stream()]
        return sales
