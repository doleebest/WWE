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
    
    def update_sale_status(self, product_id, new_status):
        self.db.child("item").child(product_id).update({"state": new_status})
        print(f"Updated product {product_id} to {new_status}")
        
    # 사용자 정보 업데이트 함수 추가
    def update_user_info(self, user_id, new_email=None, new_phone=None):
        # 사용자 정보 조회
        user_ref = self.db.child("user").order_by_child("id").equal_to(user_id).get()

        if user_ref.val() is None:  # 사용자가 존재하지 않으면 실패
            return False

        # 해당 사용자의 정보를 업데이트
        for user in user_ref.each():
            user_key = user.key()  # 사용자 고유 키

            # 변경된 값만 업데이트
            updates = {}
            if new_email:
                updates['email'] = new_email
            if new_phone:
                updates['phone'] = new_phone

            # Firebase에서 사용자 정보 업데이트
            self.db.child("user").child(user_key).update(updates)
            print(f"User {user_id} updated with email: {new_email}, phone: {new_phone}")
            return True
        return False
