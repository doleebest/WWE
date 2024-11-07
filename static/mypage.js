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
