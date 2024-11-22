import pyrebase
import json
import re

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
    
    def get_items(self):
        items = self.db.child("item").get().val()
        return items
    
    def get_item_byname(self, name):
        items = self.db.child("item").get()
        target_value=""
        print("###########",name)
        for res in items.each():
            key_value = res.key()
            if key_value == name:
                target_value=res.val()
        return target_value

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

    def validate_user_id(self,id):
        # 영문자로 시작하고, 영문자와 숫자만 포함하며 5~15자 길이
        pattern = r'^[a-zA-Z][0-9a-zA-Z]{4,14}$'
        return re.match(pattern, id)

    def validate_password(self,pw):
        # 최소 8자, 문자, 숫자, 특수문자 각각 1개 이상 포함
        pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        return re.match(pattern, pw)
        
    def find_user(self, id_, pw_):  
        users = self.db.child("user").get()
        target_value=[]
        for res in users.each():
            value = res.val()
            if value['id'] == id_ and value['pw'] == pw_:
              return True
        return False
    
    # my page 관련
    def get_user_wishlist(self,id):
        wishlist_ref = self.db.child('wishlist').order_by_child('id').equal_to(id).get()
        wishlist = [item.val() for item in wishlist_ref.each()]
        return wishlist

    def get_user_purchases(self,id):
        purchases_ref = self.db.child('purchases').order_by_child('id').equal_to(id).get()
        purchases = [item.val() for item in purchases_ref.each()]
        return purchases

    def get_user_sales(self,id):
        sales_ref = self.db.child('products').order_by_child('sellerId').equal_to(id).get()
        sales = [item.val() for item in sales_ref.each()]
        return sales
    
    def get_heart_by_name(self, uid, name):
        hearts = self.db.child("heart").child(uid).get()
        target_value=""
        if hearts.val() == None:
            return target_value

        for res in hearts.each():
            key_value = res.key()
            if key_value == name:
                target_value=res.val()

        return target_value

    def update_heart(self, user_id, isHeart, item):
        heart_info = {"interested" : isHeart}
        self.db.child("heart").child(user_id).child(item).set(heart_info)
        return True
