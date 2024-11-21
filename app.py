from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify, abort
from database import DBhandler
import hashlib

ITEM_COUNT_PER_PAGE = 12

application = Flask(__name__)
application.config["SECRET_KEY"] = "helloosp"

DB = DBhandler()

# 홈화면
@application.route("/")
def hello():
    page = request.args.get("page", 1, type=int)
    start_index = ITEM_COUNT_PER_PAGE * (page - 1)
    end_index = ITEM_COUNT_PER_PAGE * page

    data = DB.get_items()
    total_item_count = len(data)
    data = dict(list(data.items())[start_index:end_index])

    return render_template(
        "index.html",
        datas = data.items(),
        limit = ITEM_COUNT_PER_PAGE, # 한 페이지에 상품 개수
        page = page, # 현재 페이지 인덱스
        page_count = int((total_item_count/ITEM_COUNT_PER_PAGE)+1), # 페이지 개수
        total = total_item_count) # 총 상품 개수

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
    return redirect(url_for('hello'))

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


@application.route("/list")
def view_list():
    return render_template("list.html")

# 리뷰 상세 페이지
# TODO: 리뷰어 정보 가져오기
@application.route("/review/<name>/")
def view_review(name):
    # DB에서 리뷰정보 및 상품정보 가져옴
    review = DB.get_review_by_name(name)
    item = DB.get_item_byname(name)

    # 리뷰정보 혹은 상품정보 없을 경우 404
    if not review or not item:
        return abort(404)
    return render_template(
        "review.html", 
        review=review,  # 리뷰 정보
        item=item,  # 상품 정보
        name=name
    )

# 리뷰 등록 페이지
# TODO: 리뷰 등록한 날짜도 함께 저장
@application.route("/writereview/<name>/")
def write_review(name):
    # DB에서 상품 정보를 가져옴
    item = DB.get_item_byname(name)

    # 상품 정보가 없을 경우 404
    if item is None:
        return abort(404)
    return render_template(
        "writereview.html", 
        item=item, 
        name=name
    )

# 리뷰 등록 POST
@application.route("/submit_review/", methods=['POST'])
def submit_review():
    data=request.form
    image_file=request.files["file"]
    image_file.save("static/images/{}".format(image_file.filename))
    DB.reg_review(data, image_file.filename)
    return redirect(url_for('mypage'))  # TODO: redirect 어디로 할 건지 결정

# 상품 등록 페이지
@application.route("/reg_items")
def reg_item():
    return render_template("register.html")

@application.route("/detail")
def detail():
    return render_template("detail.html")

@application.route("/submit_product_post", methods=['POST'])
def reg_item_submit_post():
    image_file = request.files["file"]
    image_file.save("static/images/{}".format(image_file.filename))
    data = request.form
    DB.insert_item(data['productName'], data, image_file.filename)
    return render_template("submit_item_result.html", data=data, img_path="static/images/{}".format(image_file.filename))

@application.route("/detail/<name>/")
def view_item_detail(name):
    print("###name:",name)
    data = DB.get_item_byname(str(name))
    print("####data:",data)
    return render_template("detail.html", name=name, data=data)

if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)