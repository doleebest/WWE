from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify, abort
from database import DBhandler
from datetime import datetime
import hashlib
import math

ITEM_COUNT_PER_PAGE = 12
REVIEW_COUNT_PER_PAGE = 6   # 마이페이지 내의 전체 리뷰 조회

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
    if total_item_count <= ITEM_COUNT_PER_PAGE:
        data = dict(list(data.items())[:total_item_count])
    else:
        data = dict(list(data.items())[start_index:end_index])

    return render_template(
        "index.html",
        datas = data.items(),
        limit = ITEM_COUNT_PER_PAGE, # 한 페이지에 상품 개수
        page = page, # 현재 페이지 인덱스
        page_count = int(math.ceil(total_item_count/ITEM_COUNT_PER_PAGE)), # 페이지 개수
        total = total_item_count) # 총 상품 개수

@application.route("/<continent>/")
def view_items_by_continent(continent):
    page = request.args.get("page", 1, type=int)
    start_index = ITEM_COUNT_PER_PAGE * (page - 1)
    end_index = ITEM_COUNT_PER_PAGE * page

    data = DB.get_items_by_continent(continent)
    total_item_count = len(data)
    if total_item_count <= ITEM_COUNT_PER_PAGE:
        data = dict(list(data.items())[:total_item_count])
    else:
        data = dict(list(data.items())[start_index:end_index])

    return render_template(
        "index.html",
        datas = data.items(),
        limit = ITEM_COUNT_PER_PAGE, # 한 페이지에 상품 개수
        page = page, # 현재 페이지 인덱스
        page_count = int(math.ceil(total_item_count/ITEM_COUNT_PER_PAGE)), # 페이지 개수
        total = total_item_count) # 총 상품 개수

@application.route("/search", methods=['GET'])
def search_items():
    query = request.args.get('query')
    page = request.args.get("page", 1, type=int)
    start_index = ITEM_COUNT_PER_PAGE * (page - 1)
    end_index = ITEM_COUNT_PER_PAGE * page

    data = DB.get_items_by_query(query)
    total_item_count = len(data)
    if total_item_count <= ITEM_COUNT_PER_PAGE:
        data = dict(list(data.items())[:total_item_count])
    else:
        data = dict(list(data.items())[start_index:end_index])

    return render_template(
        "index.html",
        datas = data.items(),
        limit = ITEM_COUNT_PER_PAGE, # 한 페이지에 상품 개수
        page = page, # 현재 페이지 인덱스
        page_count = int(math.ceil(total_item_count/ITEM_COUNT_PER_PAGE)), # 페이지 개수
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
            flash("잘못된 아이디 또는 비밀번호 입니다.")
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
    email=request.form['email']
    phone=request.form['phone']
    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    # ID와 비밀번호 유효성 검사
    if not DB.validate_user_id(id):
        flash("ID는 영문자로 시작하고, 영문자와 숫자만 포함하며 5~15자여야 합니다!")
        return render_template("signup.html")
    if not DB.validate_password(pw):
        flash("비밀번호는 최소 8자이며, 문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다!")
        return render_template("signup.html")
    if not DB.validate_email(email) :
        flash("올바른 이메일 형식이 아닙니다!")
        return render_template("signup.html")
    if not DB.validate_phone(phone) :
        flash("올바른 전화번호 형식이 아닙니다!")
        return render_template("signup.html")    

    
    #사용자 정보 삽입
    if DB.insert_user(data,pw_hash):
        return render_template("login.html")
    else :
        flash("user id already exist!")
        return render_template("signup.html")

@application.route('/check_id_duplicate', methods=['POST'])
def check_id_duplicate():
    """Endpoint to check if an ID is already in use."""
    id_to_check = request.json.get('id')  # Expecting JSON payload with 'id'
    if not id_to_check:
        return jsonify({'success': False, 'message': 'ID not provided'}), 400

    is_available = DB.user_duplicate_check(id_to_check)
    if is_available:
        return jsonify({'success': True, 'message': 'ID is available'})
    else:
        return jsonify({'success': False, 'message': 'ID is already in use'})
    
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

"""
@application.route("/mypage/profile/update", methods=["POST"])
def update_user_info():
    data = request.json
<<<<<<< HEAD
    id = session.get('id')
=======
    user_id = 'user_id_example'  # 사용자 ID는 세션 등에서 가져올 수 있음
>>>>>>> 4e1dd14 (fix : crash)
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
"""

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
    data=request.form.to_dict()
    image_file=request.files["file"]
    image_file.save("static/images/{}".format(image_file.filename))

    # 데이터에 현재 시간 추가 (2024.02.05 03:08 형식)
    current_time = datetime.now().strftime("%Y.%m.%d %H:%M")
    data['review_time'] = current_time

    DB.reg_review(data, image_file.filename)
    return redirect(url_for('mypage'))  # TODO: redirect 어디로 할 건지 결정

@application.route("/view/all-reviews", methods=['GET'])
def all_reviews():
    id = session.get('id')
    if not id:
        return redirect(url_for('login'))
    page = request.args.get("page", 0, type=int)

    # 페이지 시작 및 끝 인덱스
    start_idx = REVIEW_COUNT_PER_PAGE * page
    end_idx = REVIEW_COUNT_PER_PAGE * (page + 1)

    # db에서 id(회원)이 작성한 리뷰들 전체
    data = DB.get_all_review_by_id(id)
    item_counts = len(data)  # 총 리뷰 개수
    current_page_data = list(data.items())[start_idx:end_idx]

    print(current_page_data)

    # JSON 응답으로 반환
    return render_template(
        "all_reviews.html",
        reviews=current_page_data,  # key-value 쌍 리스트로 보냄
        limit=REVIEW_COUNT_PER_PAGE,  # 한 화면에 보일 리뷰 개수
        page=page,  # 현재 페이지
        page_count=(item_counts + REVIEW_COUNT_PER_PAGE - 1) // REVIEW_COUNT_PER_PAGE,  # 총 페이지 수
        total=item_counts  # 전체 리뷰 개수
    )

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

# 좋아요
@application.route('/show_heart/<name>/', methods=['GET'])
def show_heart(name):
    my_heart = DB.get_heart_by_name(session['id'],name)
    return jsonify({'my_heart': my_heart})

@application.route('/like/<name>/', methods=['POST'])
def like(name):
    my_heart = DB.update_heart(session['id'],'Y',name)
    return jsonify({'msg': '좋아요 완료!'})

@application.route('/unlike/<name>/', methods=['POST'])
def unlike(name):
    my_heart = DB.update_heart(session['id'],'N',name)
    return jsonify({'msg': '안좋아요 완료!'})

# 좋아요 전체 조회(회원별)
@application.route('/mypage/likelist/<id>/', methods=['GET'])
def likelist(id):
    like_list = DB.get_all_like_by_id(id)
    return jsonify(like_list)

if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)
