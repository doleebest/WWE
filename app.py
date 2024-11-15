from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
from database import DBhandler
import sys, hashlib

application = Flask(__name__)
application.config["SECRET_KEY"] = "helloosp"

DB = DBhandler()

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
    pw=request.form['pw']
    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    if DB.insert_user(data,pw_hash):
        return render_template("login.html")
    else :
        flash("user id already exist!")
        return render_template("signup.html")
    
# my page 관련 routing
@application.route("/mypage")
def mypage():
    user_id = session.get('user_id')
    if not user_id : 
        return redirect(url_for('login'))
    wishlist = DB.get_user_wishlist(user_id)
    purchase_history = DB.get_user_purchase_history(user_id)
    sales_history = DB.get_user_sales_history(user_id)
    
    return render_template(
        'mypage.html',
        wishlist=wishlist,
        purchase_history=purchase_history,
        sales_history=sales_history,
    )

@application.route('/mypage/<int:user_id>/wishlist', methods=['GET'])
def wishlist(user_id):
    wishlist = DB.get_user_wishlist(user_id)
    if not wishlist:
        return jsonify({'error': 'No items in wishlist'}), 404
    return jsonify(wishlist), 200

@application.route('/mypage/<int:user_id>/purchases', methods=['GET'])
def purchases(user_id):
    purchases = DB.get_user_purchases(user_id)
    if not purchases:
        return jsonify({'error': 'No purchase history'}), 404
    return jsonify(purchases), 200

@application.route('/mypage/<int:user_id>/sales', methods=['GET'])
def sales(user_id):
    sales = DB.get_user_sales(user_id)
    if not sales:
        return jsonify({'error': 'No sales history'}), 404
    return jsonify(sales), 200


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
    

