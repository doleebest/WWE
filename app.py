from flask import Flask, render_template, request, flash, redirect, url_for, session
from database import DBhandler
import sys, hashlib
import firebase_admin
from firebase_admin import credentials, auth, exceptions

application = Flask(__name__)
application.config["SECRET_KEY"] = "helloosp"

DB = DBhandler()

# Firebase 초기화
cred = credentials.Certificate("authentication/firebase_auth.json")  # JSON 파일 경로
firebase_admin.initialize_app(cred)

@application.route("/")
def hello():
    return render_template("index.html")

#@application.route("/login")
#def login():
#    return render_template("login.html")
@application.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        id = request.form['id']
        pw = request.form['pw']
        try:
            # Firebase에서 사용자 ID로 로그인 처리
            user = auth.get_user(id)
            # 인증 성공 시 세션에 사용자 정보를 저장
            session['user_id'] = user.uid
            return redirect('/')
        except exceptions.FirebaseError:
            flash('Invalid id or password')
    return render_template('login.html')

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
    

@application.route("/mypage")
def mypage():
    return render_template("mypage.html")

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
    DB.insert_item(data['name'], data, image_file.filename)
    
    return render_template("submit_item_result.html", data=data, img_path="static/images/{}".format(image_file.filename))

if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)
