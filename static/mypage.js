document.addEventListener("DOMContentLoaded", function () {
  const pageNumbers = document.querySelectorAll(".page-number");

  pageNumbers.forEach((page) => {
      page.addEventListener("click", function () {
          pageNumbers.forEach((p) => p.classList.remove("active"));
          this.classList.add("active");
          // 페이지 넘버 클릭 시 로직 추가
      });
  });

  // Tab 메뉴 기능
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
          tabs.forEach((t) => t.classList.remove("active"));
          tabContents.forEach((content) => content.style.display = "none");

          this.classList.add("active");
          document.getElementById(this.getAttribute("onclick").split("'")[1]).style.display = "block";
      });
  });

  // 기본 탭 설정
  document.getElementById("wishlist").style.display = "block";
});

document.addEventListener("DOMContentLoaded", function () {
  // 페이지 번호 활성화 처리
  const pageNumbers = document.querySelectorAll(".page-number");

  pageNumbers.forEach((page) => {
      page.addEventListener("click", function () {
          pageNumbers.forEach((p) => p.classList.remove("active"));
          this.classList.add("active");
      });
  });

  // Tab 메뉴 기능
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
          tabs.forEach((t) => t.classList.remove("active"));
          tabContents.forEach((content) => content.style.display = "none");

          this.classList.add("active");
          document.getElementById(this.getAttribute("onclick").split("'")[1]).style.display = "block";
      });
  });

  // 기본 탭 설정
  document.getElementById("wishlist").style.display = "block";

  // 판매 상태를 "판매 완료"와 "판매 미완"으로 토글하는 함수
  window.toggleSaleStatus = function (button) {
      const isSelling = button.classList.contains("selling");

      if (isSelling) {
          // 판매 중 상태에서 판매 완료 상태로 변경
          button.classList.remove("selling");
          button.classList.add("soldout");
          button.innerHTML = '<img src="{{ url_for("static", filename="images/soldout.png") }}" alt="판매 완료">';
      } else {
          // 판매 완료 상태에서 판매 중 상태로 변경
          button.classList.remove("soldout");
          button.classList.add("selling");
          button.innerHTML = '<img src="{{ url_for("static", filename="images/selling.png") }}" alt="판매 미완">';
      }
  };

  // 항목을 삭제하는 함수
  window.deleteItem = function (button) {
      const item = button.closest(".product-item");
      item.remove(); // 클릭한 항목을 리스트에서 제거
  };
});
