from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify, abort
from database import DBhandler
from datetime import datetime
from flask import jsonify
import hashlib
import math

ITEM_COUNT_PER_PAGE = 12
REVIEW_COUNT_PER_PAGE = 6   # 마이페이지 내의 전체 리뷰 조회

application = Flask(__name__)
application.config["SECRET_KEY"] = "helloosp"

DB = DBhandler()

# 홈화면
@application.route("/")
# @application.route("/<continent>")
def get_data(continent=None):
    page = request.args.get('page', 1, type=int)
    query = request.args.get('query' , None)
    continent = request.args.get('continent' , None)
    start_index = ITEM_COUNT_PER_PAGE * (page - 1)
    end_index = ITEM_COUNT_PER_PAGE * page

    if query is not None:
        data = DB.get_items_by_query(query)
    elif continent is not None:
        # continent가 있을 경우 해당 대륙의 데이터만 가져오기
        data = DB.get_items_by_continent(continent)
    else:
    # 모든 데이터를 가져오기
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
    return redirect("/")

@application.route("/signup")
def signup():
    return render_template("signup.html")

@application.route("/signup_post", methods=['POST'])
def register_user() :
    data = request.form.to_dict()
    print(data)
    data['region'] = None if data.get('region') in [None, '', 'none'] else data['region']
    data['phone'] = None if data.get('phone') in [None, '', 'none'] else data['phone']
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
    if phone and not DB.validate_phone(phone):
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
@application.route("/mypage", defaults={'id': None})
@application.route("/mypage/<id>")
def mypage(id):
    # 현재 로그인된 사용자
    current_user = session.get('id')
    if not current_user:
        return redirect(url_for('login'))
    
    # user_id가 없으면 자신의 페이지로 설정
    if id is None:
        id = current_user

    # 사용자 데이터
    seller = DB.get_user_by_id(id)
    if not seller:
        return abort(404)  # 사용자 정보가 없으면 404

    # 페이징 처리
    page = request.args.get("page", 0, type=int)
    start_idx = REVIEW_COUNT_PER_PAGE * page
    end_idx = REVIEW_COUNT_PER_PAGE * (page + 1)

    # 데이터 가져오기
    like_list = DB.get_liked_item_details(id)
    purchase_history = DB.get_user_purchases(id)
    sales_history = DB.get_user_sales(id)
    data = DB.get_all_review_by_id(id)
    item_counts = len(data)
    current_page_data = list(data.items())[start_idx:end_idx]

    # 자신 페이지 여부 확인
    is_own_page = (current_user == id)

    return render_template(
        'mypage.html',
        seller=seller,
        purchases=purchase_history,
        products=sales_history,
        reviews=current_page_data,
        limit=REVIEW_COUNT_PER_PAGE,
        page=page,
        page_count=(item_counts + REVIEW_COUNT_PER_PAGE - 1) // REVIEW_COUNT_PER_PAGE,
        likes=like_list,
        is_own_page=is_own_page
    )


# 마이페이지 구매 내역 전체 조회
@application.route('/mypage/purchases', methods=['GET'])
def get_user_purchases():
    # 요청에서 사용자 ID 가져오기
    id = session.get('id')
    if not id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        # "purchases" 테이블에서 buyerId가 user_id인 모든 구매 내역 가져오기
        purchases = DB.child("purchases").order_by_child("buyerId").equal_to(id).get()

        # 구매 내역 확인
        if not purchases.each():
            return jsonify({"purchases": []}), 200

        # 데이터 포맷팅
        purchase_list = [purchase.val() for purchase in purchases.each()]
        return jsonify({"purchases": purchase_list}), 200

    except Exception as e:
        # 예외 처리
        return jsonify({"error": "Failed to retrieve purchases", "details": str(e)}), 500


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

@application.route('/user/<user_id>')
def user_page(user_id):
    # 현재 로그인된 사용자
    current_user = session.get('user_id')

    # 사용자 데이터 가져오기
    user_wishlist = DB.get_user_wishlist(user_id)
    user_purchases = DB.get_user_purchases(user_id)
    user_sales = DB.get_user_sales(user_id)

    # 현재 사용자가 자신의 마이페이지인지 확인
    is_own_page = (current_user == user_id)

    return render_template(
        'user_page.html',
        is_own_page=is_own_page,
        user_wishlist=user_wishlist,
        user_purchases=user_purchases,
        user_sales=user_sales,
        user_id=user_id
    )

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
@application.route("/review/<name>/")
def view_review(name):
    review = DB.get_review_by_name(name)
    item = DB.get_item_byname(name)
    seller = DB.get_user_by_id('sj')

    # 리뷰정보 혹은 상품정보 없을 경우 404
    if not review or not item:
        return abort(404)
    return render_template(
        "review.html", 
        review=review,  # 리뷰 정보
        item=item,  # 상품 정보
        name=name,
        seller=seller
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
    id = session.get('id')
    if not id or not (user := DB.get_user_by_id(id)):
        return redirect(url_for('login'))
    image_file = request.files["file"]
    image_file.save("static/images/{}".format(image_file.filename))
    data = request.form
    product_name = data['productName']
    DB.insert_item(product_name, data, image_file.filename, user)
    return redirect(url_for("view_item_detail", name=product_name))


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

@application.route("/mark_as_sold", methods=["POST"])
def mark_as_sold():
    id = session.get('id')
    if not id:
        return jsonify({"error": "로그인되지 않았습니다."}), 403  # JSON 응답

    seller_id = session["id"]  # 현재 로그인된 판매자 ID
    data = request.json  # JSON 데이터를 받음
    product_id = data.get("product_id")
    buyer_id = data.get("buyer_id")

    if not product_id or not buyer_id:
        return jsonify({"error": "상품 ID와 구매자 ID를 모두 입력해주세요."}), 400

    # 판매자 확인
    product = DB.get_item_byname(product_id)
    if not product or product.get("sellerId") != seller_id:
        return jsonify({"error": "이 상품에 대한 권한이 없습니다."}), 403

    # 판매 완료 처리
    if DB.mark_item_as_sold(product_id, buyer_id):
        return jsonify({"message": f"상품 {product_id}이(가) {buyer_id}에게 판매 완료 처리되었습니다."}), 200
    else:
        return jsonify({"error": "판매 완료 처리 중 문제가 발생했습니다."}), 500


@application.route("/mark_as_unsold", methods=["POST"])
def mark_as_unsold(product_id):
    if not session.get("user_id"):
        return abort(403)  # 로그인되지 않은 경우 접근 불가

    seller_id = session["user_id"]  # 현재 로그인된 판매자 ID

    # 판매자 확인
    product = DB.get_item_byname(product_id)
    if product.get("sellerId") != seller_id:
        flash("이 상품에 대한 권한이 없습니다.", "error")
        return redirect(url_for("mypage"))

    # 판매 미완료 처리
    if DB.mark_item_as_unsold(product_id):
        flash(f"상품 {product_id}이(가) 판매 미완료 상태로 변경되었습니다.", "success")
    else:
        flash("판매 미완료 처리 중 문제가 발생했습니다.", "error")

    return redirect(url_for("mypage"))
