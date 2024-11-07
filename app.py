from flask import Flask, render_template, request
import sys

# template과 static 폴더 불러오는 경로 변경
application = Flask(__name__, template_folder="src/pages", static_folder="src")

@application.route("/")
def hello():
    return render_template("index.html")

@application.route("/list")
def view_list():
    return render_template("list.html")

@application.route("/review")
def view_review():
    return render_template("review.html")

@application.route("/reg_items")
def reg_item():
    return render_template("register.html")

@application.route("/reg_reviews")
def reg_review():
    return render_template("reg_reviews.html")

# POST 방식으로 하면 form을 통으로 넘겨받음.
@application.route("/submit_product_post", methods=['POST'])
def reg_item_submit_post():
    image_file=request.files["file"]
    image_file.save("src/image/{}".format(image_file.filename))

    data=request.form
    return render_template("submit_item_result.html", data=data, img_path="src/image/{}".format(image_file.filename))

if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)