from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
from database import DBhandler
import sys, hashlib

application = Flask(__name__)
application.config["SECRET_KEY"] = "helloosp"

DB = DBhandler()

@application.route("/")
def hello():
    return render_template("index.html")

@application.route("/login")
def login():
    return render_template("login.html")

@application.route('/login_confirm', methods=['POST'])
def login_user():
        id = request.form['id']
        pw = request.form['pw']
        pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
        if DB.find_user(id,pw_hash) :
            session['id']=id
            return redirect('/')
        else:
            flash("wrong ID or PW!")
            return render_template("login.html")
        
@application.route("/logout")
def logout_user():
    session.clear()
    return redirect(url_for('/'))

@application.route("/signup")
def signup():
    return render_template("signup.html")

@application.route("/signup_post", methods=['POST'])
def register_user() :
    data=request.form
    id=request.form['id']
    pw=request.form['pw']
    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    # ID와 비밀번호 유효성 검사
    if not DB.validate_user_id(id):
        flash("ID는 영문자로 시작하고, 영문자와 숫자만 포함하며 5~15자여야 합니다!")
        return render_template("signup.html")
    if not DB.validate_password(pw):
        flash("비밀번호는 최소 8자이며, 문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다!")
        return render_template("signup.html")
    
    #사용자 정보 삽입
    if DB.insert_user(data,pw_hash):
        return render_template("login.html")
    else :
        flash("user id already exist!")
        return render_template("signup.html")
    
# my page 관련 routing
@application.route("/mypage")
def mypage():
    id = session.get('id')
    if not id : 
        return redirect(url_for('login'))
    
    #사용자가 마이페이지를 열면, 각각을 데베에서 가져온다.
    wishlist = DB.get_user_wishlist(id)
    purchase_history = DB.get_user_purchases(id)
    sales_history = DB.get_user_sales(id)
    
    return render_template(
        'mypage.html',
        wishlist=wishlist,
        purchase_history=purchase_history,
        sales_history=sales_history,
    )

@application.route('/mypage/wishlist', methods=['GET'])
def wishlist():
    id = session.get('id')
    if not id:
        return redirect(url_for('login'))
    wishlist = DB.get_user_wishlist(id)
    return jsonify(wishlist or []), 200  # 빈 리스트 반환

@application.route('/mypage/purchases', methods=['GET'])
def purchases():
    id = session.get('id')
    if not id:
        return redirect(url_for('login'))
    purchases = DB.get_user_purchases(id)
    return jsonify(purchases or []), 200

@application.route('/mypage/sales', methods=['GET'])
def sales(id):
    id = session.get('id')
    if not id:
        return redirect(url_for('login'))
    sales = DB.get_user_sales(id)
    return jsonify(sales or []), 200

# 판매 상태 업데이트
@application.route("/mypage/sales/update_status", methods=['POST'])
def update_sale_status():
    id = session.get('id')
    if not id:
        return redirect(url_for('login'))

    data = request.json
    product_id = data.get("product_id")
    status = data.get("status")

    if not DB.update_sale_status(id, product_id, status):
        return jsonify({"error": "Failed to update sale status"}), 500

    return jsonify({"message": "Sale status updated"}), 200

# 상품 삭제
@application.route("/mypage/sales/delete", methods=['POST'])
def delete_sale():
    id = session.get('id')
    if not id:
        return redirect(url_for('login'))

    product_id = request.json.get("product_id")
    if not DB.delete_product(id, product_id):
        return jsonify({"error": "Failed to delete product"}), 500

    return jsonify({"message": "Product deleted successfully"}), 200


@application.route("/mypage/profile/update", methods=["POST"])
def update_user_info():
    data = request.json
    user_id = 'user_id_example'  # 사용자 ID는 세션 등에서 가져올 수 있음
    new_email = data.get("email")
    new_phone = data.get("phone")

    db_handler = DBhandler()

    # 이메일, 전화번호 중 적어도 하나가 주어져야 업데이트가 진행됨
    if not new_email and not new_phone:
        return jsonify({"success": False, "message": "이메일 또는 전화번호를 입력하세요."}), 400

    # 사용자 정보 업데이트
    success = db_handler.update_user_info(user_id, new_email=new_email, new_phone=new_phone)
    if success:
        return jsonify({"success": True, "message": "정보가 업데이트되었습니다."}), 200
    else:
        return jsonify({"success": False, "message": "정보 업데이트에 실패했습니다."}), 500


@application.route("/list")
def view_list():
    return render_template("list.html")

@application.route("/review")
def view_review():
    return render_template("review.html")

@application.route("/writereview")
def write_review():
    return render_template("writereview.html")

@application.route("/reg_items")
def reg_item():
    return render_template("register.html")

@application.route("/reg_reviews")
def reg_review():
    return render_template("reg_reviews.html")

@application.route("/detail")
def detail():
    return render_template("detail.html")

# POST 방식으로 form 데이터를 받아 처리
@application.route("/submit_product_post", methods=['POST'])
def reg_item_submit_post():
    image_file = request.files["file"]
    image_file.save("static/images/{}".format(image_file.filename))
    data = request.form
    DB.insert_item(data['productName'], data, image_file.filename)
    return render_template("submit_item_result.html", data=data, img_path="static/images/{}".format(image_file.filename))

if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)
    

