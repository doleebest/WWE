// mypage 함수 정의
const mypage = () => {
  // 네비게이션 바 설정
  const mypageNavBar = document.querySelector("#navbar__menu__mypage");
  mypageNavBar.classList.add("navbar__menu_selected");

  // 페이지 번호 활성화 설정
  const pageNumbers = document.querySelectorAll(".page-number");
  pageNumbers.forEach((page) => {
    page.addEventListener("click", function () {
      pageNumbers.forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Tab 메뉴 설정
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => (content.style.display = "none"));

      this.classList.add("active");
      document.getElementById(this.getAttribute("onclick").split("'")[1]).style.display = "block";
    });
  });

  // 기본 탭 설정
  document.getElementById("wishlist").style.display = "block";

document.addEventListener('DOMContentLoaded', function() {
    // 삭제 버튼 이벤트 리스너
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.product-item').remove();
        });
    });

    // 판매 상태 토글 버튼 이벤트 리스너
    document.querySelectorAll('.toggle-sale-status').forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === '판매 미완') {
                this.textContent = '판매 완료';
                this.classList.remove('soldout');
                this.classList.add('completed');
            } else if (this.textContent === '판매 완료') {
                this.textContent = '판매 미완';
                this.classList.remove('completed');
                this.classList.add('soldout');
            }
        });
    });
});

  // 항목 삭제 함수
  window.deleteItem = function (button) {
    const item = button.closest(".product-item");
    item.remove();
  };
};

// 초기화 함수 정의
const init = () => {
  mypage();
};

// DOMContentLoaded 후 초기화
document.addEventListener("DOMContentLoaded", init);
